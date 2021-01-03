from mywebassign.models import User, Question, Course
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
    ("demoStudent@aol.com", False),
    ]

# number of non-demo users (including demo users)
n_teacher = 5
n_student = 25

with app.app_context():
    db.drop_all()
    db.create_all()
    for i in range(n_teacher + n_student):
        created_at = fake.date_time_between(start_date=datetime(2000, 1, 15))
        db.session.add(User(
            email= users[i][0] if (i < 2) else fake.simple_profile()["mail"],
            isTeacher= i == 0 or (i > 1 and i < n_teacher + 1),
            password="password",
            created_at=created_at,
            updated_at=fake.date_time_between(start_date=created_at)
        ))
    db.session.commit()

questions = [
    (1, "{0} plus {1} equals ... ", "x0 + x1", [[2, 3, 10], [5, 7, 20]]),
    (1, "{0} times {1} equals ... ","x0 * x1", [[-3, -1, 20], [2, 3, 10]]),
    (1, "{0} divided by {1} equals ... ","x0/x1", [[2, 4, 20], [1, 3, 20]]),
    (1, "{0} raised to power of {1} equals ... ", "x0^x1", [[2, 6, 4], [2, 5, 3]]),
    (1, "The square root of {0} equals ...", "sqrt(x0)", [[2, 99, 97]]),
    (1, "{0} * {1} + {2} equals ... ", "x0 * x1 + x2", [[2,7,5], [2,9,7], [2,15,13]]),
    (1, "ln {0} equals ... ", "log(x0)", [[2, 99, 97]]),
    (1, "log {0} equals ...", "log(x0)/log(10)", [[2, 99, 97]]),
    (1, "cos {0} rads equals ... ", "cos(x0)", [[-3, 3, 60]]),
    (1, "arctan {0} equals ... (in radians)", "atan(x0)", [[-4, 4, 80]])
    ]

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

courses = [
"DemoClass",
"Aeronautics",
"Algebra",
"Archaeology",
"Art",
"Astrology",
"Astronomy",
"Biology",
"Botany",
"Chemistry",
"Dance",
"Earth Science",
"Egyptology",
"Engineering",
"French",
"Geography",
"Geology",
"Geometry",
"German",
"Heiroglyphics",
"History",
"Italian",
"Karate",
"Latin",
"Music",
"Physics",
"Portuguese",
"Russian",
"Spanish",
]

with app.app_context():

    for i in range(len(courses)):
        created_at = fake.date_time_between(start_date=datetime(2000, 1, 15))
        if (i == 1 or random() < 1/n_teacher):
            teacher_id = 1
        else:
            teacher_id = randrange(2, 2 + n_teacher)
        db.session.add(Course(
            teacher_id=teacher_id,
            name=courses[i],
            created_at=created_at,
            updated_at=created_at,
        ))
    db.session.commit()
