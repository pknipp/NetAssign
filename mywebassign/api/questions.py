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
        print("q_and_a = ", q_and_a)
        question = q_and_a['question']
        print("question = ", question)
        inputs = json.loads(q_and_a['inputs'])
        print("inputs = ", inputs)
        print("inputs[0][1] = ", inputs[0][1])
        print("inputs[1] = ", inputs[1])
        answer = q_and_a['answer']
        print("answer = ", answer)
        x = list()
        x.append(inputs[0][0] + (inputs[0][1] - inputs[0][0]) * randint(0,inputs[0][2])/inputs[0][2])
        x.append(inputs[1][0] + (inputs[1][1] - inputs[1][0]) * randint(0,inputs[1][2])/inputs[1][2])
        specific_question = question.format(x[0], x[1])
        specific_answer   = cexprtk.evaluate_expression(answer, {"x0": x[0], "x1": x[1]})
        return {"specific_question": specific_question, "specific_answer": specific_answer}
