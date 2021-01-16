import json
import cexprtk
from random import random, randint, seed
from datetime import date, datetime, timedelta
from sqlalchemy import and_
from flask_login import current_user
from flask import Blueprint, request, redirect
from net_assign.models import db, Assignment, Deployment, Submission, Appearance, Question, User

submissions = Blueprint('submissions', __name__)

seed()

@submissions.route('/<did>', methods=['GET'])
def get_questions(did):
    deployment_id = int(did)
    student_id = current_user.id
    is_instructor = User.query.filter(User.id == student_id).one_or_none().is_instructor
    dec = 4
    if request.method == 'GET':
        submission = Submission.query.filter(and_(Submission.deployment_id == deployment_id, Submission.student_id == student_id)).one_or_none()
        deployment = Deployment.query.filter(Deployment.id == deployment_id).one_or_none()
        assignment = Assignment.query.filter(Assignment.id == deployment.assignment_id).one_or_none()
        qars = list()
        qrs = list()
        if submission:
            qars = json.loads(submission.questions_and_answers_and_responses)
            for qar in qars:
                if not is_instructor:
                    qar.answer = None
                qrs.append(qar)
        else:
            appearances = Appearance.query.filter(Appearance.assignment_id == assignment.id)
            for appearance in appearances:
                q_and_a = Question.query.filter(Question.id == appearance["question_id"]).one_or_none()
                question = q_and_a.question
                inputs = json.loads(q_and_a.inputs)
                answer = q_and_a.answer
                x = list()
                input = dict()
                for i in range(len(inputs)):
                    x.append(round(inputs[i][0]+(inputs[i][1]-inputs[i][0])*randint(0, inputs[i][2])/inputs[i][2],dec))
                    input["x" + str(i)] = x[i]
                question = question.format(*x)
                answer = round(cexprtk.evaluate_expression(answer, input),dec)
                response = None
                question_and_answer_and_response = {"id": q_and_a.id, "question": question,"answer": answer, "response": response}
                qars.append(question_and_answer_and_response)
                # Do not include answer in list to be sent to front-end, except for instructors
                if not is_instructor:
                    del question_and_answer_and_response["answer"]
                qrs.append(question_and_answer_and_response)
            new_submission = Submission(
                student_id=student_id,
                deployment_id=deployment_id,
                questions_and_answers_and_responses=json.dumps(qars),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.session.add(new_submission)
            db.session.commit()
        return {"questions_and_responses": qrs, "assignment_name": assignment.name}

@submissions.route('/<did_and_qindex>', methods=['PUT'])
def put_question(did_and_qindex):
    tolerance = 0.02
    ids = did_and_qindex.split(" ")
    deployment_id = int(ids[0])
    student_id = current_user.id
    is_instructor = User.query.filter(User.id == student_id).one_or_none().is_instructor
    question_index = int(ids[1])
    if request.method == 'PUT':
        submission = Submission.query.filter(and_(Submission.deployment_id == deployment_id, Submission.student_id == student_id)).one_or_none()
        qars = json.loads(submission.questions_and_answers_and_responses)
        qar = qars[question_index]
        answer = qar["answer"]
        response = request.json.get("response", None)
        qar["response"] = response
        qars[question_index] = qar
        submission.questions_and_answers_and_responses = json.dumps(qars)
        submission.updated_at = datetime.now()
        db.session.commit()
        grade = None
        if response != None:
            grade = abs(answer - response) <= tolerance * abs(answer) or abs(answer - response) < tolerance
        res = {"grade": grade}
        if is_instructor:
           res["answer"] = answer
        return res
