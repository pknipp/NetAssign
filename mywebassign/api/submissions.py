import json
import cexprtk
from random import random, randint
from datetime import date, datetime, timedelta
from flask import Blueprint, request, redirect
from mywebassign.models import db, Assignment, Deployment, Submission, Appearance, Question
# from flask_login import login_required, logout_user, login_user, current_user

submissions = Blueprint('submissions', __name__)


@submissions.route('/<did_and_uid>', methods=['GET'])
def get_questions(did_and_uid):
    ids = did_and_uid.split(" ")
    deployment_id = int(ids[0])
    student_id = int(ids[1])
    if request.method == 'GET':
        submission = Submission.query.filter(Submission.deployment_id == deployment_id and Submission.student_id == student_id).all()
        specific_q_and_as = list()
        if not submission:
            deployment = Deployment.query.filter(Deployment.id == deployment_id).all()[0].to_dict()
            assignment = Assignment.query.filter(Assignment.id == deployment_id).all()[0].to_dict()
            appearances = Appearance.query.filter(Appearance.assignment_id == assignment["id"])
            for appearance in appearances:
                appearance = appearance.to_dict()
                q_and_a = Question.query.filter(Question.id == appearance["question_id"]).all()[0].to_dict()
                print("q_and_a = ", q_and_a)
                question = q_and_a['question']
                inputs = json.loads(q_and_a['inputs'])
                answer = q_and_a['answer']
                x = list()
                input_dict = dict()
                for i in range(len(inputs)):
                    x.append(inputs[i][0]+(inputs[i][1]-inputs[i][0])*randint(0, inputs[i][2])/inputs[i][2])
                    input_dict["x" + str(i)] = x[i]
                specific_question = question.format(*x)
                specific_answer = round(cexprtk.evaluate_expression(answer, input_dict),4)
                specific_q_and_as.append({"id": q_and_a["id"], "question": specific_question, "answer": specific_answer})
            new_submission = Submission(
                student_id=student_id,
                deployment_id=deployment_id,
                json_content=json.dumps(specific_q_and_as),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.session.add(new_submission)
            db.session.commit()
        return({"questions": specific_q_and_as})
