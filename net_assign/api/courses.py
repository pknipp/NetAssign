from flask import Blueprint, request, redirect
from net_assign.models import db, Enrollment, Course, User
from flask_login import current_user
from datetime import datetime

courses = Blueprint('courses', __name__)


@courses.route('/me', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return {"courses": [course.to_dict() for course in Course.query]}
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

@courses.route('/<course_id>', methods=['GET', 'DELETE', 'PUT'])
def one(course_id):
    course = Course.query.filter(Course.id == int(course_id)).one_or_none()
    if request.method == 'GET':
        return {"course": course.to_dict()}
    if request.method == 'DELETE':
        db.session.delete(course)
        db.session.commit()
        return {"message": "I hope that you no longer need this course."}
    if request.method == 'PUT':
        if not request.is_json:
            return jsonify({"message": "Missing JSON in request"}), 400
        course.name = request.json.get('name', None)
        course.updated_at = datetime.now()
        db.session.commit()
        return {"message": "I hope that you like the new name for this course."}
