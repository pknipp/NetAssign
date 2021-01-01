from flask import Blueprint, jsonify, request, redirect
from petstagram.models import User, db, Follow
from datetime import datetime
from flask_login import login_required, logout_user, login_user, current_user
from sqlalchemy import or_

users = Blueprint('users', __name__)


@users.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        response = User.query.filter(User.can_follow).all()
        return {"users": [user.to_dict() for user in response]}
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        # canfollow = request.json.get("canfollow", None)
        username = request.json.get('username', None)
        user = User.query.filter(User.user_name == username).one_or_none()
        if user:
            return {"errors": ["That username has already been taken."]}, 500
        password = request.json.get('password', None)
        password2 = request.json.get('password2', None)
        fullname = request.json.get("fullname", None)
        email = request.json.get('email', None)
        if not username or not password:
            return {"errors": ["Missing required parameters"]}, 400
        if not password == password2:
            return {"errors": ["Passwords must match each other"]}, 400
        new_user = User(
            can_follow=True,
            user_name=username,
            first_name=fullname,
            last_name=fullname,
            full_name=fullname,
            DOB=datetime.now(),
            email=email,
            password=password,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_user)
        db.session.commit()
        # return redirect('/api/users')
        authenticated, user = User.authenticate1(username, password)
        if authenticated:
            login_user(user)
            return {"current_user_id": current_user.id, "current_user": current_user.to_dict()}
        return {"errors": ["Invalid credentials"]}, 401


@users.route('/<id>', methods=['GET', 'PUT', 'DELETE'])
def user_info(id):
    user = User.query.filter(User.id == int(id))[0]
    if request.method == "GET":
        return user.to_dict()
    if request.method == 'DELETE':
        if user.id == 1:
            return {"errors": ["Don't take Doug. We love Doug! (He's our 'demo'.) Create a new account if you would like to test the 'Delete' route."]}, 401
        follows = Follow.query.filter(
            or_(Follow.follower_id == int(id), Follow.followed_id == int(id))).all()
        for follow in follows:
            db.session.delete(follow)
        db.session.delete(user)
        db.session.commit()
        logout_user()

        return {"message": "goodbye"}
    if request.method == 'PUT':
        if user.id == 1:
            return {"errors": ["Don't edit Doug's details. We love him just as he is! (He's our 'demo'.) Create a new account if you would like to test the 'Update User' route."]}, 401

        username = request.json.get('username', None)
        user_former = User.query.filter(User.user_name == username).one_or_none()
        if user_former:
            return {"errors": ["That username has already been taken."]}, 500

        userd = user.to_dict()
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        user.can_follow = request.json.get('canfollow', None)

        # username = request.json.get('username', None)
        # user = User.query.filter(User.user_name == username).one_or_none()
        # if user:
        #     return {"errors": ["That username has already been taken."]}, 500
        # user.user_name = username or userd["user_name"]

        user.password = request.json.get(
            'password', None)  # or userd["password"]
        user.password2 = request.json.get(
            'password2', None)  # or userd["password2"]
        user.first_name = request.json.get(
            'fullname', None) or userd["first_name"]
        user.last_name = request.json.get(
            "fullname", None) or userd["last_name"]
        user.email = request.json.get('email', None) or userd["email"]
        user.full_name = request.json.get(
            "fullname", None) or userd["full_name"]
        user.website = request.json.get('website', None) or userd["website"]
        user.bio = request.json.get('bio', None) or userd["bio"]
        user.phone = request.json.get('phone', None) or userd["phone"]
        user.gender = request.json.get('gender', None) or userd["gender"]
        user.updated_at = datetime.now()
        password = request.json.get('password', None)
        password2 = request.json.get('password2', None)
        if not password or not password2:
            return {"errors": ["Missing required parameters"]}, 400
        if password == password2:
            user.password = password
        else:
            return {"errors": ["Passwords must match."]}, 400

        db.session.commit()
        return user.to_dict()
