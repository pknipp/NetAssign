from flask import Blueprint, request, redirect
from net_assign.models import db, Enrollment, Course, User
from flask_login import current_user
from datetime import datetime

enrollments = Blueprint('enrollments', __name__)

# @enrollments.route('/', methods=['GET'])
# def index():
#     student_id = current_user.id
#     if request.method == 'GET':
#         enrollments = Enrollment.query.filter(Enrollment.student_id == student_id)
#         courses = list()
#         for enrollment in enrollments:
#             course_id = enrollment.to_dict()["course_id"]
#             course = Course.query.filter(Course.id == course_id).one_or_none().to_dict()
#             instructor = User.query.filter(User.id == course["instructor_id"]).one_or_none().to_dict()
#             courses.append({"course": course, "instructor": instructor})
#         return {"courses": courses}

@enrollments.route('/<student_id_and_course_id>', methods=['GET', 'DELETE', 'POST'])
def index(student_id_and_course_id):
    ids = student_id_and_course_id.split(' ')
    student_id = int(ids[0])
    course_id = int(ids[1])
    # student_id= current_user.id
    if request.method == 'GET':
        if not course_id:
            enrollments = Enrollment.query.filter(Enrollment.student_id == student_id)
            courses = list()
            for enrollment in enrollments:
                course_id = enrollment.to_dict()["course_id"]
                course = Course.query.filter(Course.id == course_id).one_or_none().to_dict  ()
                instructor = User.query.filter(User.id == course["instructor_id"]). one_or_none().to_dict()
                courses.append({"course": course, "instructor": instructor})
            return {"courses": courses}
    if request.method == 'DELETE':
        enrollment = Enrollment.query.filter(Enrollment.course_id == course_id).filter(Enrollment.student_id == student_id).one_or_none()
        db.session.delete(enrollment)
        db.session.commit()
        return {"message": "This class will miss you."}
    if request.method == 'POST':
        new_enrollment = Enrollment(
            student_id=student_id,
            course_id=course_id,
            created_at=datetime.now()
        )
        db.session.add(new_enrollment)
        db.session.commit()
        return {"message": "We hope that you enjoy the class."}
