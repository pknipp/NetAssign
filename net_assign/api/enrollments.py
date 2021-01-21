from flask import Blueprint, request, redirect
from net_assign.models import db, Enrollment, Course, User
from flask_login import current_user
from datetime import datetime
from sqlalchemy import and_

enrollments = Blueprint('enrollments', __name__)

@enrollments.route('/<student_id_and_course_id>', methods=['POST', 'GET', 'DELETE'])
def index(student_id_and_course_id):
    ids = student_id_and_course_id.split(' ')
    student_id = int(ids[0])
    course_id = int(ids[1])
    instructor_id = Course.query.get(course_id).instructor_id
    if not instructor_id == current_user.id:
        return {"errors": ["You are not authorized to this."]}, 401

    if request.method == 'POST':
        new_enrollment = Enrollment(
            student_id=student_id,
            course_id=course_id,
            created_at=datetime.now()
        )
        db.session.add(new_enrollment)
        db.session.commit()
        return {"message": "We hope that you enjoy the class."}

    if request.method == 'GET':
        if not course_id:
            enrollments = Enrollment.query.filter(Enrollment.student_id == student_id)
            courses = list()
            for enrollment in enrollments:
                course = Course.query.get(enrollment.course_id)
                instructor = User.query.get(course.instructor_id)
                courses.append({"course": course.to_dict(), "instructor": instructor.to_dict()})
            return {"courses": courses}
        if not student_id:
            enrollments = Enrollment.query.filter(Enrollment.course_id == course_id)
            students = list()
            for enrollment in enrollments:
                student = User.query.get(enrollment.student_id)
                students.append(student.to_dict())
            return {"students": students}

    if request.method == 'DELETE':
        enrollment = Enrollment.query.filter(Enrollment.course_id == course_id).filter(Enrollment.student_id == student_id).one_or_none()
        db.session.delete(enrollment)
        db.session.commit()
        return {"message": "This class will miss you."}
