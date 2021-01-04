from flask import Blueprint, request, redirect
from mywebassign.models import db, Assignment, Deployment, Submission, Appearance
# from flask_login import login_required, logout_user, login_user, current_user

submissions = Blueprint('submissions', __name__)


@submissions.route('/<did_and_uid>', methods=['GET'])
def get_questions(did_and_uid):
    ids = did_and_uid.split(" ")
    deployment_id = int(ids[0])
    student_id = int(ids[1])
    if request.method == 'GET':
        submission = Submission.query.filter(Submission.deployment_id == deployment_id and Submission.student_id == student_id).all()
        questions = list()
        if not submission:
            deployment = Deployment.query.filter(Deployment.id == deployment_id).all()[0].to_dict()
            assignment = Assignment.query.filter(Assignment.id == deployment_id).all()[0].to_dict()
            appearances = Appearance.query.filter(Appearance.assignment_id == assignment["id"])
            for appearance in appearances:
                appearance = appearance.to_dict()
                questions.append(appearance)
        return({"questions": questions})
