from flask import Blueprint, request, redirect
from net_assign.models import db, Enrollment, Course, User
from flask_login import current_user
from datetime import datetime

courses = Blueprint('courses', __name__)


@courses.route('/', methods=['GET'])
def index():
    student_id = current_user.id
    if request.method == 'GET':
        courses = Course.query
        courses = [course.to_dict() for course in courses]
        return({"courses": courses})

@courses.route('/<course_id>', methods=['GET', 'DELETE', 'PUT'])
def get_course(course_id):
    course = Course.query.filter(Course.id == int(course_id)).one_or_none()
    if request.method == 'GET':
        return({"course": course.to_dict()})
    if request.method == 'DELETE':
        db.session.delete(course)
        db.session.commit()
        return {"message": "I hope that you no longer need this course."}
    if request.method == 'PUT':
        course.name = request.json.get('name', None)
        course.updated_at = datetime.now()
        db.session.commit()
        return {"message": "I hope that you like the new name for this course."}
