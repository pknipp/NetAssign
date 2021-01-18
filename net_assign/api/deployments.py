from flask import Blueprint, request, redirect
from net_assign.models import db, Assignment, Deployment, Course

deployments = Blueprint('deployments', __name__)

@deployments.route('/<deployment_id>', methods=['GET', 'DELETE', 'PUT'])
def index(deployment_id):
    deployment = Deployment.query.get(int(deployment_id))
    if request.method == 'GET':
        deployment = Deployment.query.get(int(deployment_id))
        assignment = Assignment.query.get(deployment.assignment_id)
        course = Course.query.get(deployment.course_id)
        return({"course_name":course.name, "assignment_name": assignment.name, "deadline": deployment.deadline, "course_id": course.id})
    if request.method == 'DELETE':
        db.session.delete(deployment)
        db.session.commit()
        return {"message": "I hope that no one needs that deployment."}

@deployments.route('/courses/<course_id>', methods=['GET'])
def get_deployments(course_id):
    if request.method == 'GET':
        deployments = Deployment.query.filter(Deployment.course_id == int(course_id)).order_by(Deployment.deadline)
        course_name = Course.query.get(int(course_id)).name
        assignments = list()
        for deployment in deployments:
            assignment = Assignment.query.get(deployment.assignment_id)
            assignments.append({"assignment": assignment.to_dict(), "deployment": deployment.to_dict()})
        return {"assignments": assignments, "course_name": course_name}
