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

users = [("demo@aol.com", True), ("jdoe@aol.com", False)]
questions = [(1, "{0} plus {1} equals ... ", [[2, 3, 20], [5, 7, 200]], "x0 + x1")]

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
            inputs=json.dumps(question[2]),
            answer=question[3],
            created_at=created_at,
            updated_at=fake.date_time_between(start_date=created_at)
        ))
    db.session.commit()
