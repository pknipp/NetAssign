from mywebassign.models import User, Question
from mywebassign import app, db
from dotenv import load_dotenv
from datetime import date, datetime, timedelta
from faker import Faker
from random import randrange, seed, random
from werkzeug.security import generate_password_hash, check_password_hash
import json

seed(1)
fake = Faker()
load_dotenv()

users = [
    ("demoTeacher@aol.com", True),
    ("johndoe@aol.com", True),
    ("demoStudent@aol.com", False),
    ("johnnydoe@aol.com", False)
    ]
questions = [
    (1, "{0} plus {1} equals ... ", "x0 + x1", [[2, 3, 10], [5, 7, 20]]),
    (1, "{0} times {1} equals ... ","x0 * x1", [[-3, -1, 20], [2, 3, 10]]),
    (1, "{0} divided by {1} equals ... ","x0/x1", [[2, 4, 20], [1, 3, 20]]),
    (1, "{0} raised to power of {1} equals ... ", "x0^x1", [[2, 6, 4], [2, 5, 3]]),
    (1, "The square root of {0} equals ...", "sqrt(x0)", [[2, 12, 10]]),
    (1, "{0} * {1} + {2} equals ... ", "x0 * x1 + x2", [[0,3,3], [1,4,3], [2,5,3]]),
    (1, "ln {0} equals ... ", "log(x0)", [[2, 9, 7]]),
    (1, "log {0} equals ...", "log(x0)/log(10)", [[2, 19, 17]]),
    (1, "cos {0} rads equals ... ", "cos(x0)", [[0, 2, 20]]),
    (1, "arctan {0} equals ... (in radians)", "atan(x0)", [[1, 5, 4]])
    ]

with app.app_context():
    db.drop_all()
    db.create_all()
    for user in users:
        created_at = fake.date_time_between(start_date=datetime(2000, 1, 15))
        db.session.add(User(
            email=user[0],
            isTeacher=user[1],
            password="password",
            created_at=created_at,
            updated_at=fake.date_time_between(start_date=created_at)
        ))
    db.session.commit()


with app.app_context():
    for question in questions:
        created_at = fake.date_time_between(start_date=datetime(2000, 1, 15))
        db.session.add(Question(
            teacher_id=question[0],
            question=question[1],
            answer=question[2],
            inputs=json.dumps(question[3]),
            created_at=created_at,
            updated_at=fake.date_time_between(start_date=created_at)
        ))
    db.session.commit()
