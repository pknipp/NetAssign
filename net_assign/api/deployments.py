from flask import Blueprint, request, redirect
from net_assign.models import db, Assignment, Deployment, Course
# from flask_login import login_required, logout_user, login_user, current_user

deployments = Blueprint('deployments', __name__)

@deployments.route('/<deployment_id>/', methods=['GET', 'DELETE', 'PUT'])
def index(deployment_id):
    deployment = Deployment.query.filter(Deployment.id == int(deployment_id)).one_or_none()
    if request.method == 'GET':
        deployment = Deployment.query.filter(Deployment.id == deployment_id).one_or_none()
        deployment_d = deployment.to_dict()
        assignment = Assignment.query.filter(Assignment.id == deployment_d["assignment_id"]).one_or_none()
        course = Course.query.filter(Course.id == deployment_d["course_id"]).one_or_none()
        return({"course_name":course.to_dict()["name"], "assignment_name": assignment.to_dict()["name"], "deadline": deployment_d["deadline"], "course_id": course.to_dict()["id"]})
    if request.method == 'DELETE':
        db.session.delete(deployment)
        db.session.commit()
        return {"message": "I hope that no one needs that deployment."}

@deployments.route('/courses/<course_id>/', methods=['GET'])
def get_deployments(course_id):
    if request.method == 'GET':
        deployments = Deployment.query.filter(Deployment.course_id == int(course_id)).order_by(Deployment.deadline)
        course_name = Course.query.filter(Course.id == int(course_id)).one_or_none().to_dict()["name"]
        assignments = list()
        for deployment in deployments:
            deployment_d = deployment.to_dict()
            assignment_id = deployment_d["assignment_id"]
            assignments.append({"assignment": Assignment.query.filter(Assignment.id == assignment_id).one_or_none().to_dict(), "deployment": deployment_d})
        return {"assignments": assignments, "course_name": course_name}
