from flask import Blueprint, request, redirect
from my_assign.models import db, Enrollment, Course, User
# from flask_login import login_required, logout_user, login_user, current_user

enrollments = Blueprint('enrollments', __name__)


@enrollments.route('/<student_id>', methods=['GET'])
def get_courses(student_id):
    if request.method == 'GET':
        enrollments = Enrollment.query.filter(Enrollment.student_id == int(student_id))
        courses = list()
        for enrollment in enrollments:
            course_id = enrollment.to_dict()["course_id"]
            course = Course.query.filter(Course.id == course_id).one_or_none().to_dict()
            instructor = User.query.filter(User.id == course["instructor_id"]).one_or_none().to_dict()
            courses.append({"course": course, "instructor": instructor})
        return({"courses": courses})
