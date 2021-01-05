from flask import Blueprint, request, redirect
from my_assign.models import db, Assignment, Deployment
# from flask_login import login_required, logout_user, login_user, current_user

deployments = Blueprint('deployments', __name__)


@deployments.route('/<course_id>', methods=['GET'])
def get_deployments(course_id):
    if request.method == 'GET':
        deployments = Deployment.query.filter(Deployment.course_id == int(course_id))
        assignments = list()
        for deployment in deployments:
            deployment_d = deployment.to_dict()
            assignment_id = deployment_d["assignment_id"]
            assignments.append({"assignment": Assignment.query.filter(Assignment.id == assignment_id)[0].to_dict(), "deployment": deployment_d})
        return({"assignments": assignments})
