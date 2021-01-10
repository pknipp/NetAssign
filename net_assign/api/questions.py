from flask import Blueprint, jsonify, request, redirect
from net_assign.models import Question, db, User
from datetime import datetime
# from flask_login import login_required, logout_user, login_user, current_user
from sqlalchemy import or_
from random import random, randint
import cexprtk
import json

questions = Blueprint('questions', __name__)


@questions.route('/<uid>', methods=['GET'])
def index(uid):
    if request.method == 'GET':
        user_id = int(uid)
        print(user_id)
        q_and_a_and_is = Question.query.filter(Question.instructor_id == user_id)
        # q_and_a_and_is = Question.query.all()
        # print(len(q_and_a_and_is))
        questions = list()
        for q_and_a_and_i in q_and_a_and_is:
            q_and_a_and_i = q_and_a_and_i.to_dict()
            author = User.query.filter(User.id == q_and_a_and_i["instructor_id"]).one_or_none().to_dict()["email"]
            question = q_and_a_and_i['question']
            answer   = q_and_a_and_i['answer']
            inputs = json.loads(q_and_a_and_i['inputs'])
            questions.append({"id": q_and_a_and_i["id"], "author": author, "question": question, "answer": answer, "inputs": inputs})
        return({"questions": questions})
