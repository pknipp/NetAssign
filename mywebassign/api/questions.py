from flask import Blueprint, jsonify, request, redirect
from mywebassign.models import Question, db
from datetime import datetime
# from flask_login import login_required, logout_user, login_user, current_user
from sqlalchemy import or_
from random import random, randint
from pymep.realParser import parse
import cexprtk
import json
from pymep.realParser import eval

questions = Blueprint('questions', __name__)


@questions.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        response = Question.query.all()[0]
        q_and_a = response.to_dict()
        question = q_and_a['question']
        inputs = json.loads(q_and_a['inputs'])
        answer = q_and_a['answer']
        x = list()
        input_dict = dict()
        for i in range(len(inputs)):
            x.append(inputs[i][0]+(inputs[i][1]-inputs[i][0])*randint(0, inputs[i][2])/inputs[i][2])
            input_dict["x" + str(i)] = x[i]
        specific_question = question.format(*x)
        specific_answer = cexprtk.evaluate_expression(answer, input_dict)
        return {"specific_question": specific_question, "specific_answer": specific_answer}
