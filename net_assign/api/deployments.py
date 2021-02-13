from flask import Blueprint, request, redirect
from net_assign.models import db, Assignment, Deployment, Course
from flask_login import current_user
from datetime import datetime
from sqlalchemy import or_, and_

deployments = Blueprint('deployments', __name__)

@deployments.route('/<deployment_id>', methods=['GET', 'PUT', 'DELETE'])
def index(deployment_id):
    deployment = Deployment.query.get(int(deployment_id))
    instructor_id = Course.query.get(deployment.course_id).instructor_id
    if not instructor_id == current_user.id:
        return {"errors": ["You are not authorized to this."]}, 401
    if request.method == 'GET':
        assignment = Assignment.query.get(deployment.assignment_id)
        course = Course.query.get(deployment.course_id)
        return({"course_name":course.name, "assignment_name": assignment.name, "deadline": deployment.deadline.isoformat(), "course_id": course.id})
    if request.method == 'PUT':
        deployment.deadline = datetime.strptime(request.json.get('deadline', None), '%Y-%m-%dT%H:%M:%S')
        deployment.updated_at = datetime.now()
        db.session.commit()
        return ({"message": "success"})
    if request.method == 'DELETE':
        db.session.delete(deployment)
        db.session.commit()
        return {"message": "I hope that no one needs that deployment."}

@deployments.route('/courses/<course_id>', methods=['GET'])
def get_deployments(course_id):
    instructor_id = Course.query.get(course_id).instructor_id
    if not instructor_id == current_user.id:
        return {"errors": ["You are not authorized to this."]}, 401
    if request.method == 'GET':
        deployments = Deployment.query.filter(Deployment.course_id == int(course_id)).order_by(Deployment.deadline)
        course_name = Course.query.get(int(course_id)).name
        assignments = list()
        for deployment in deployments:
            assignment = Assignment.query.get(deployment.assignment_id)
            assignments.append({"assignment": assignment.to_dict(), "deployment": deployment.to_dict()})
        all_assignments = Assignment.query.filter(or_(Assignment.instructor_id == instructor_id, Assignment.is_public)).order_by(Assignment.id)
        other_assignments = list()
        for assignment in all_assignments:
            deployments = Deployment.query.filter(and_(Deployment.course_id == int(course_id), Deployment.assignment_id == assignment.id))
            if not deployments:
                other_assignments.append(assignment.to_dict())
        return {"assignments": assignments, "course_name": course_name, "other_assignments": other_assignments}
