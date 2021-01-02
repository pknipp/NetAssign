from flask import Blueprint, jsonify, request, redirect
from mywebassign.models import Question, db
from datetime import datetime
# from flask_login import login_required, logout_user, login_user, current_user
from sqlalchemy import or_

questions = Blueprint('questions', __name__)


@questions.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        response = Question.query.all()
        return {"questions": [question.to_dict() for question in response]}
