from flask import Blueprint, request, redirect
from net_assign.models import db, Enrollment, Course, User, Deployment
from flask_login import current_user
from datetime import datetime

courses = Blueprint('courses', __name__)

@courses.route('', methods=['POST', 'GET'])
def index():

    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"message": "Missing JSON in request"}), 400
        new_course = Course(
            instructor_id=current_user.id,
            name=request.json.get('name', None),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_course)
        db.session.commit()
        new_enrollment = Enrollment(
            student_id=current_user.id,
            course_id=new_course.id,
            created_at=datetime.now()
        )
        db.session.add(new_enrollment)
        db.session.commit()
        return {"message": "successfully added a course"}

    if request.method == 'GET':
        return {"courses": [course.to_dict() for course in Course.query]}

@courses.route('/<course_id>', methods=['POST', 'GET', 'DELETE', 'PUT'])
def one(course_id):
    print("top of courses/course_id route, with method = ", request.method, " and course_id = ", course_id)
    course = Course.query.get(int(course_id))
    deployments = Deployment.query.filter(Deployment.course_id == course_id)

    # duplicating a course
    if request.method == 'POST':
        new_course = Course(
            instructor_id=current_user.id,
            name=course.name + '(COPY)',
            is_public=course.is_public,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_course)
        db.session.commit()
        # include all deployments (as Appearances are included, for duplicated assignments)
        for deployment in deployments:
            new_deployment = Deployment(
                assignment_id=deployment.assignment_id,
                course_id=new_course.id,
                created_at=datetime.now(),
                updated_at=datetime.now(),
                deadline=datetime.now()
            )
            db.session.add(new_deployment)
        new_enrollment = Enrollment(
            student_id=current_user.id,
            course_id=new_course.id,
            created_at=datetime.now()
        )
        db.session.add(new_enrollment)
        db.session.commit()
        return {"message": "success"}

    if request.method == 'GET':
        return {"course": course.to_dict()}

    if request.method == 'PUT':
        if not request.is_json:
            return jsonify({"message": "Missing JSON in request"}), 400
        course.name = request.json.get('name', None)
        course.is_public = request.json.get('isPublic', None)
        print("course.is_public = ", course.is_public)
        course.updated_at = datetime.now()
        db.session.commit()
        return {"message": "I hope that you like the new name for this course."}

    if request.method == 'DELETE':
        db.session.delete(course)
        db.session.commit()
        return {"message": "I hope that you no longer need this course."}
