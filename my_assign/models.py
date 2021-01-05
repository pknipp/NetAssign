from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    is_instructor = db.Column(db.Boolean, nullable=False)
    email = db.Column(db.String(63), nullable=False, unique=True)
    hashed_password = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @classmethod
    def authenticate(cls, email, password):
        user = cls.query.filter(User.email == email).scalar()
        if user:
            return check_password_hash(user.hashed_password, password), user
        else:
            return False, None

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_instructor": self.is_instructor,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class Question(db.Model, UserMixin):
    __tablename__ = 'questions'

    id = db.Column(db.Integer, primary_key=True)
    instructor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    question = db.Column(db.String(127), nullable=False)
    inputs = db.Column(db.String(127), nullable=False)
    answer = db.Column(db.String(63), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "instructor_id": self.instructor_id,
            "question": self.question,
            "inputs": self.inputs,
            "answer": self.answer,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class Assignment(db.Model, UserMixin):
    __tablename__ = 'assignments'

    id = db.Column(db.Integer, primary_key=True)
    instructor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(63), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "instructor_id": self.instructor_id,
            "name": self.name,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class Appearance(db.Model, UserMixin):
    __tablename__ = 'appearances'

    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignments.id"), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    db.UniqueConstraint(assignment_id, question_id)

    def to_dict(self):
        return {
            "id": self.id,
            "assignment_id": self.assignment_id,
            "question_id": self.question_id,
            "created_at": self.created_at
        }


class Course(db.Model, UserMixin):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True)
    instructor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(63), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "instructor_id": self.instructor_id,
            "name": self.name,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class Enrollment(db.Model, UserMixin):
    __tablename__ = 'enrollments'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    db.UniqueConstraint(student_id, course_id)

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "course_id": self.course_id,
            "created_at": self.created_at
        }


class Deployment(db.Model, UserMixin):
    __tablename__ = 'deployments'

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignments.id"), nullable=False)
    deadline = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "course_id": self.course_id,
            "assignment_id": self.assignment_id,
            "deadline": self.deadline,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class Submission(db.Model, UserMixin):
    __tablename__ = 'submissions'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    deployment_id = db.Column(db.Integer, db.ForeignKey("deployments.id"), nullable=False)
    questions = db.Column(db.Text, nullable=False)
    answers = db.Column(db.Text, nullable=False)
    responses = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)
    db.UniqueConstraint(student_id, deployment_id)

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "deployment_id": self.deployment_id,
            "questions": self.questions,
            "answers": self.answers,
            "responses": self.responses,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
