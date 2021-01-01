from petstagram.models import User, Post, Comment, Like, Follow
from petstagram import app, db
from dotenv import load_dotenv
from datetime import date, datetime, timedelta
from faker import Faker
from random import randrange, seed, random
from werkzeug.security import generate_password_hash, check_password_hash

seed(1)
fake = Faker()
load_dotenv()


with app.app_context():
    db.drop_all()
    db.create_all()
    # number of users, including demo_user
    n_user = 2
    created_at = datetime(2000, 1, 15)
    db.session.add(User(
        user_name="demo_user",
        first_name="Demo",
        last_name="User",
        full_name="Demo User",
        DOB=datetime(1980, 10, 31),
        password="password",
        email="demo@user.com",
        created_at=created_at,
        updated_at=datetime(2005, 2, 25),
    ))
    user_t = [created_at]
    for _ in range(1, n_user):
        DOB = fake.date_of_birth(minimum_age=14, maximum_age=100)
        created_at = fake.date_time_between(start_date=datetime(1980, 10, 31))
        user_t.append(created_at)
        db.session.add(User(
            user_name=fake.simple_profile()["username"],
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            full_name=fake.name(),
            email=fake.simple_profile()["mail"],
            DOB=DOB,
            password="password",
            created_at=created_at,
            updated_at=fake.date_time_between(start_date=created_at)
        ))
    db.session.commit()

with app.app_context():

    # avg number of posts per user
    n_post_per_user = 1
    n_post = n_user * n_post_per_user

    post_t = []
    for _ in range(n_post):
        user_id = randrange(n_user)
        created_at = fake.date_time_between(
            start_date=user_t[user_id]
        )
        post_t.append(created_at)
        db.session.add(Post(
            user_id=user_id + 1,
            photo_url=fake.isbn10(),
            created_at=created_at,
            updated_at=created_at,
            caption=fake.paragraph(nb_sentences=2, variable_nb_sentences=True),
        ))

    db.session.commit()
with app.app_context():

    # avg number of comments per post
    n_comment_per_post = 1
    n_comment = n_post * n_comment_per_post

    for _ in range(n_comment):
        comment_t = []
        user_id = randrange(n_user)
        post_id = randrange(n_post)
        t_user = user_t[user_id]
        t_post = post_t[post_id]
        latest_t = t_user if t_user < t_post else t_post
        created_at = fake.date_time_between(start_date=latest_t)
        comment_t.append(created_at)
        db.session.add(Comment(
            user_id=user_id + 1,
            post_id=post_id + 1,
            created_at=created_at,
            updated_at=created_at,
            content=fake.paragraph(nb_sentences=2, variable_nb_sentences=True)
        ))
    db.session.commit()

with app.app_context():
    # probability of a user liking a post:
    like_prob = 0.5
    like_t = []
    for user_id in range(n_user):
        t_user = user_t[user_id]
        for post_id in range(n_post):
            t_post = post_t[post_id]
            if random() < like_prob:
                later_t = t_post if t_post > t_user else t_user
                created_at = fake.date_time_between(start_date=later_t)
                like_t.append(created_at)
                db.session.add(Like(
                    user_id=user_id + 1,
                    post_id=post_id + 1,
                    created_at=created_at,
                ))
    db.session.commit()

with app.app_context():
    # probability of one user following another:
    follow_prob = 0.5
    follow_t = []
    for follower_id in range(n_user):
        t_follower = user_t[follower_id]
        for followed_id in range(n_user):
            t_followed = user_t[followed_id]
            if random() < follow_prob and not follower_id == followed_id:
                later_t = t_followed if t_followed > t_follower else t_follower
                created_at = fake.date_time_between(start_date=later_t)
                follow_t.append(created_at)
                db.session.add(Follow(
                    follower_id=follower_id + 1,
                    followed_id=followed_id + 1,
                    created_at=created_at,
                ))
    db.session.commit()
