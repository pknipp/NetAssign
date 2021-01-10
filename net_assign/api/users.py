from flask import Blueprint, jsonify, request, redirect
from net_assign.models import User, db
from datetime import datetime
from flask_login import login_required, logout_user, login_user, current_user

users = Blueprint('users', __name__)


@users.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        response = User.query.all()
        return {"users": [user.to_dict() for user in response]}
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        if not email or not password:
            return {"errors": ["Missing required parameters"]}, 400
        user = User.query.filter(User.email == email).one_or_none()
        if user:
            return {"errors": ["That email has already been taken."]}, 500
        password2 = request.json.get('password2', None)
        if not password == password2:
            return {"errors": ["Passwords must match each other"]}, 400
        new_user = User(
            email=email,
            password=password,
            is_instructor=False,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_user)
        db.session.commit()
        # return redirect('/api/users')
        authenticated, user = User.authenticate(email, password)
        if authenticated:
            login_user(user)
            return {"current_user": current_user.to_dict()}
        return {"errors": ["Invalid credentials"]}, 401


@users.route('/', methods=['GET', 'PUT', 'DELETE'])
def user_info():
    user = current_user
    userd= user.to_dict()
    if request.method == "GET":
        return userd
    if request.method == 'DELETE':
        if user.id == 1 or user.id == 2:
            return {"errors": ["Don't delete one of our 'demo' users. Create a new account if you would like to test the 'Delete' route."]}, 401
        db.session.delete(user)
        db.session.commit()
        logout_user()
        return {"message": "goodbye"}
    if request.method == 'PUT':
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        if user.id == 1 or user.id == 2:
            return {"errors": ["Don't edit the details for one of our demo users.  Create a new account if you would like to test the 'Update User' route."]}, 401
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        password2 = request.json.get('password2', None)
        if not password or not password2:
            return {"errors": ["Missing required parameters"]}, 400
        if password == password2:
            user.password = password
            if email:
                user_former = User.query.filter(User.email == email).one_or_none()
                if user_former:
                        return {"errors": ["That email has already been taken."]}, 500
        else:
            return {"errors": ["Passwords must match."]}, 400
        user.email = email or userd["email"]
        user.updated_at = datetime.now()
        db.session.commit()
        return user.to_dict()
