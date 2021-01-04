from flask import Blueprint, jsonify, request, redirect
from mywebassign.models import User, db
from datetime import datetime
from flask_login import LoginManager, login_required, logout_user, login_user, current_user

session = Blueprint('session', __name__)


@session.route('/', methods=['PUT', 'DELETE'])
def index():
    if request.method == 'PUT':
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        if not email or not password:
            return {"errors": ["Missing required parameters"]}, 400
        authenticated, user = User.authenticate(email, password)
        if authenticated:
            login_user(user)
            return {"current_user": current_user.to_dict()}
        return {"errors": ["Invalid credentials"]}, 401
    if request.method == 'DELETE':
        logout_user()
        return {'msg': 'You have been logged out'}, 200
