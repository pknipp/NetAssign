from flask import Blueprint, request, redirect
from net_assign.models import db, Enrollment, Course, User
from flask_login import current_user

enrollments = Blueprint('enrollments', __name__)


@enrollments.route('/', methods=['GET'])
def index():
    student_id = current_user.id
    if request.method == 'GET':
        enrollments = Enrollment.query.filter(Enrollment.student_id == student_id)
        courses = list()
        for enrollment in enrollments:
            course_id = enrollment.to_dict()["course_id"]
            course = Course.query.filter(Course.id == course_id).one_or_none().to_dict()
            instructor = User.query.filter(User.id == course["instructor_id"]).one_or_none().to_dict()
            courses.append({"course": course, "instructor": instructor})
        return({"courses": courses})

@enrollments.route('/<course_id>/', methods=['DELETE'])
def delete_enrollment(course_id):
    course_id = int(course_id)
    student_id= current_user.id
    if request.method == 'DELETE':
        enrollment = Enrollment.query.filter(Enrollment.course_id == course_id).filter(Enrollment.student_id == student_id).one_or_none()
        db.session.delete(enrollment)
        db.session.commit()
        return {"message": "This class will miss you."}
