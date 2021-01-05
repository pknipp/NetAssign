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
        questions = list()
        answers   = list()
        if submissions:
            questions = json.loads(submissions[0].to_dict()["questions"])
            answers   = json.loads(submissions[0].to_dict()["answers"])
        else:
            deployment = Deployment.query.filter(Deployment.id == deployment_id).all()[0].to_dict()
            assignment = Assignment.query.filter(Assignment.id == deployment["assignment_id"]).all()[0].to_dict()
            appearances = Appearance.query.filter(Appearance.assignment_id == assignment["id"])
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
                questions.append({"id": q_and_a["id"], "question": question })
                answers.append(answer)
            new_submission = Submission(
                student_id=student_id,
                deployment_id=deployment_id,
                questions=json.dumps(questions),
                answers=json.dumps(answers),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            db.session.add(new_submission)
            db.session.commit()
        return({"questions": questions})
