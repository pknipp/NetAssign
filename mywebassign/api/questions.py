from flask import Blueprint, jsonify, request, redirect
from mywebassign.models import Question, db
from datetime import datetime
# from flask_login import login_required, logout_user, login_user, current_user
from sqlalchemy import or_
from random import random

questions = Blueprint('questions', __name__)


@questions.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        response = Question.query.all()[0]
        question = response.to_dict()
        question_stuff = question['stuff']
        specific_question = question_stuff.format(random(), random())
        print("specific_question ", specific_question)
        return {"question": specific_question}
