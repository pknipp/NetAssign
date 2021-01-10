from flask import Blueprint, request, redirect
from net_assign.models import db, Enrollment, Course, User
from flask_login import current_user

enrollments = Blueprint('enrollments', __name__)


@enrollments.route('/', methods=['GET'])
def get_courses():
    if request.method == 'GET':
        enrollments = Enrollment.query.filter(Enrollment.student_id == current_user.id)
        courses = list()
        for enrollment in enrollments:
            course_id = enrollment.to_dict()["course_id"]
            course = Course.query.filter(Course.id == course_id).one_or_none().to_dict()
            instructor = User.query.filter(User.id == course["instructor_id"]).one_or_none().to_dict()
            courses.append({"course": course, "instructor": instructor})
        return({"courses": courses})
