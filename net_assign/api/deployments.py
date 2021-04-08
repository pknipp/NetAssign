from flask import Blueprint, request, redirect
from net_assign.models import db, Assignment, Deployment, Course, Appearance, Question, Enrollment
from flask_login import current_user
from datetime import datetime
from sqlalchemy import or_, and_
import json
from . import version

deployments = Blueprint('deployments', __name__)

@deployments.route('/<deployment_id_and_assignment_id_and_course_id>', methods=['POST', 'GET', 'PUT', 'DELETE'])
def index(deployment_id_and_assignment_id_and_course_id):
    ids = deployment_id_and_assignment_id_and_course_id.split(' ')
    deployment_id = int(ids[0])
    assignment_id = None
    course_id = None
    deployment = Deployment.query.get(deployment_id)
    if deployment:
        assignment_id = deployment.assignment_id
        course_id = deployment.course_id
    else:
        assignment_id = int(ids[1])
        course_id = int(ids[2])
    instructor_id = Course.query.get(course_id).instructor_id
    if not instructor_id == current_user.id:
        return {"errors": ["You are not authorized to this."]}, 401

    # duplicating a deployment
    if request.method == 'POST':
        new_deployment = Deployment(
            course_id=course_id,
            assignment_id=assignment_id,
            deadline=datetime.now(),
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        db.session.add(new_deployment)
        db.session.commit()
        return {"deployment_id": new_deployment.id}
    if request.method == 'GET':
        assignment = Assignment.query.get(assignment_id)
        course = Course.query.get(course_id)
        appearances = Appearance.query.filter(Appearance.assignment_id == assignment_id)
        questions = [Question.query.get(appearance.question_id) for appearance in appearances]
        question_list = list()
        for q_and_a in questions:
            id = q_and_a.id
            question_code = q_and_a.question_code
            inputs = json.loads(q_and_a.inputs)
            answer_code = q_and_a.answer_code
            q_and_a = version.version(question_code, inputs, answer_code)
            question = q_and_a["question"]
            question_list.append({"id": id, "question": question})
        return({"course_name":course.name, "assignment_name": assignment.name, "deadline": (deployment.deadline if deployment else datetime.now()).isoformat(timespec='seconds'), "course_id": course.id, "questions": question_list})
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
    course_id = int(course_id)
    instructor_id = Course.query.get(course_id).instructor_id
    enrollments = Enrollment.query.filter(Enrollment.student_id == current_user.id)
    if not instructor_id == current_user.id:
        # In above logic, check to see if user is enrolled in course
        # return {"errors": ["You are not authorized to this."]}, 401
        pass
    if request.method == 'GET':
        deployments = Deployment.query.filter(Deployment.course_id == course_id).order_by(Deployment.deadline)
        course_name = Course.query.get(course_id).name
        assignments = list()
        for deployment in deployments:
            assignment = Assignment.query.get(deployment.assignment_id)
            assignments.append({"assignment": assignment.to_dict(), "deployment": deployment.to_dict()})
        all_assignments = Assignment.query.filter(or_(Assignment.instructor_id == instructor_id, Assignment.is_public)).order_by(Assignment.id)
        other_assignments = list()
        for assignment in all_assignments:
            deployments = Deployment.query.filter(and_(Deployment.course_id == course_id, Deployment.assignment_id == assignment.id)).all()
            if not deployments:
                appearances = Appearance.query.filter(Appearance.assignment_id == assignment.id)
                questions = list()
                for appearance in appearances:
                    question = Question.query.get(appearance.question_id)
                    questions.append(question.question_code)
                other_assignments.append({"assignment":assignment.to_dict(), "questions": questions})
        return {"assignments": assignments, "course_name": course_name, "other_assignments": other_assignments}
