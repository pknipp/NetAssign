from flask import Blueprint, request, redirect
from net_assign.models import db, Enrollment, Course, User
from flask_login import current_user

courses = Blueprint('courses', __name__)


@courses.route('/', methods=['GET'])
def index():
    student_id = current_user.id
    if request.method == 'GET':
        courses = Course.query
        courses = [course.to_dict() for course in courses]
        return({"courses": courses})
