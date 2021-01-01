from flask import Blueprint, jsonify, request, redirect
from petstagram.models import User, db, Follow
from datetime import datetime
from flask_login import LoginManager, login_required, logout_user, login_user, current_user
from sqlalchemy import or_

session = Blueprint('session', __name__)


@session.route('/', methods=['PUT', 'DELETE'])
def index():
    if request.method == 'PUT':
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400

        username_or_email = request.json.get('usernameoremail', None)
        password = request.json.get('password', None)

        if not username_or_email or not password:
            return {"errors": ["Missing required parameters"]}, 400

        authenticated1, user1 = User.authenticate1(username_or_email, password)
        authenticated2, user2 = User.authenticate2(username_or_email, password)

        if authenticated1:
            user = user1
            authenticated = authenticated1
        elif authenticated2:
            user = user2
            authenticated = authenticated2
        else:
            authenticated = False
            user = None

        if authenticated:
            login_user(user)
            return {"current_user_id": current_user.id, "current_user": current_user.to_dict()}

        return {"errors": ["Invalid credentials"]}, 401
    if request.method == 'DELETE':
        logout_user()
        return {'msg': 'You have been logged out'}, 200
