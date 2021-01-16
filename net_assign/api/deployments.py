from flask import Blueprint, request, redirect
from net_assign.models import db, Assignment, Deployment, Course

deployments = Blueprint('deployments', __name__)

@deployments.route('/<deployment_id>', methods=['GET', 'DELETE', 'PUT'])
def index(deployment_id):
    deployment = Deployment.query.filter(Deployment.id == int(deployment_id)).one_or_none()
    if request.method == 'GET':
        deployment = Deployment.query.filter(Deployment.id == int(deployment_id)).one_or_none()
        assignment = Assignment.query.filter(Assignment.id == deployment.assignment_id).one_or_none()
        course = Course.query.filter(Course.id == deployment.course_id).one_or_none()
        return({"course_name":course.name, "assignment_name": assignment.name, "deadline": deployment.deadline, "course_id": course.id})
    if request.method == 'DELETE':
        db.session.delete(deployment)
        db.session.commit()
        return {"message": "I hope that no one needs that deployment."}

@deployments.route('/courses/<course_id>', methods=['GET'])
def get_deployments(course_id):
    if request.method == 'GET':
        deployments = Deployment.query.filter(Deployment.course_id == int(course_id)).order_by(Deployment.deadline)
        course_name = Course.query.filter(Course.id == int(course_id)).one_or_none().name
        assignments = list()
        for deployment in deployments:
            assignment = Assignment.query.filter(Assignment.id == deployment.assignment_id).one_or_none()
            assignments.append({"assignment": assignment.to_dict(), "deployment": deployment.to_dict()})
        return {"assignments": assignments, "course_name": course_name}
