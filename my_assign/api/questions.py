from flask import Blueprint, jsonify, request, redirect
from my_assign.models import Question, db
from datetime import datetime
# from flask_login import login_required, logout_user, login_user, current_user
from sqlalchemy import or_
from random import random, randint
import cexprtk
import json

questions = Blueprint('questions', __name__)


@questions.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        responses = Question.query.all()
        specific_q_and_as = list()
        for response in responses:
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
            specific_answer = round(cexprtk.evaluate_expression(answer, input_dict),4)
            specific_q_and_as.append({"question": specific_question, "answer": specific_answer})
        return({"specific_questions": specific_q_and_as})
