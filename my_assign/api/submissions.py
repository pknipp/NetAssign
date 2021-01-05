import json
import cexprtk
from random import random, randint, seed
from datetime import date, datetime, timedelta
from sqlalchemy import and_
from flask import Blueprint, request, redirect
from my_assign.models import db, Assignment, Deployment, Submission, Appearance, Question

submissions = Blueprint('submissions', __name__)

seed()

@submissions.route('/<did_and_uid>', methods=['GET'])
def get_questions(did_and_uid):
    ids = did_and_uid.split(" ")
    deployment_id = int(ids[0])
    student_id = int(ids[1])
    dec = 4
    if request.method == 'GET':
        submissions = Submission.query.filter(and_(Submission.deployment_id == deployment_id, Submission.student_id == student_id)).all()
        qars = list()
        qrs = list()
        if submissions:
            qars = json.loads(submissions[0].to_dict()["questions_and_answers_and_responses"])
            for qar in qars:
                qar["answer"] = None
                qrs.append(qar)
        else:
            deployment = Deployment.query.filter(Deployment.id == deployment_id).all()[0].to_dict()
            assignment = Assignment.query.filter(Assignment.id == deployment["assignment_id"]).all()[0].to_dict()
            appearances = Appearance.query.filter(Appearance.assignment_id == assignment["id"]).all()
            for appearance in appearances:
                appearance = appearance.to_dict()
                q_and_a = Question.query.filter(Question.id == appearance["question_id"]).all()[0].to_dict()
                question = q_and_a['question']
                inputs = json.loads(q_and_a['inputs'])
                answer = q_and_a['answer']
                x = list()
                input_dict = dict()
                for i in range(len(inputs)):
                    x.append(round(inputs[i][0]+(inputs[i][1]-inputs[i][0])*randint(0, inputs[i][2])/inputs[i][2],dec))
                    input_dict["x" + str(i)] = x[i]
                question = question.format(*x)
                answer = round(cexprtk.evaluate_expression(answer, input_dict),dec)
                response = None
                # Do not include answer in list to be sent to front-end.
                question_and_answer_and_response = {"id": q_and_a["id"], "question": question, "response": response}
                qrs.append(question_and_answer_and_response)
                # Include answer in list to be stored in Submissions table.
                question_and_answer_and_response["answer"] = answer
                qars.append(question_and_answer_and_response)
            new_submission = Submission(
                student_id=student_id,
                deployment_id=deployment_id,
                questions_and_answers_and_responses=json.dumps(qars),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.session.add(new_submission)
            db.session.commit()
        return({"questions_and_responses": qrs})


@submissions.route('/<did_and_uid_and_qindex>', methods=['PUT'])
def put_question(did_and_uid_and_qindex):
    ids = did_and_uid_and_qindex.split(" ")
    deployment_id = int(ids[0])
    student_id = int(ids[1])
    question_index = int(ids[2])
    if request.method == 'PUT':
        submission = Submission.query.filter(and_(Submission.deployment_id == deployment_id, Submission.student_id == student_id))[0]
        qars = json.loads(submission.to_dict()["questions_and_answers_and_responses"])
        qar = qars[question_index]
        answer = qar["answer"]
        response = request.json.get("response", None)
        qar["response"] = response
        qars[question_index] = qar
        submission.questions_and_answers_and_responses = json.dumps(qars)
        submission.updated_at = datetime.now()
        db.session.commit()
        return ({"grade": abs(answer - response) < 0.01 })