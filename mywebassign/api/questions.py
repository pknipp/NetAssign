from flask import Blueprint, jsonify, request, redirect
from mywebassign.models import Question, db
from datetime import datetime
# from flask_login import login_required, logout_user, login_user, current_user
from sqlalchemy import or_

questions = Blueprint('questions', __name__)


@questions.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        response = Question.query.all()[0]
        print("response = ", response)
        question = response.to_dict()
        print("question = ", question)
        question_stuff = question['stuff']
        print("question_stuff = ", question_stuff)
        specific_question = question_stuff.format(0.25, 0.5)
        print("specific_question ", specific_question)
        return {"question": specific_question}
