from flask import Blueprint, jsonify, request, redirect
from net_assign.models import Question, db, User
from datetime import datetime
from flask_login import login_required, logout_user, login_user, current_user
from sqlalchemy import or_
from random import random, randint
import cexprtk
import json

questions = Blueprint('questions', __name__)


@questions.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        user_id = current_user.id
        print("ids are ", user_id, " and ", current_user.id)
        q_and_a_and_is = Question.query.filter(or_(Question.instructor_id == user_id, Question.is_public == True)).order_by(Question.id)
        questions = list()
        for q_and_a_and_i in q_and_a_and_is:
            q_and_a_and_i = q_and_a_and_i.to_dict()
            author = User.query.filter(User.id == q_and_a_and_i["instructor_id"]).one_or_none().to_dict()
            question = q_and_a_and_i['question']
            answer   = q_and_a_and_i['answer']
            inputs = q_and_a_and_i['inputs']
            questions.append({"id": q_and_a_and_i["id"], "author": author, "question": question, "answer": answer, "inputs": inputs})
        return({"questions": questions})

@questions.route('/<qid>', methods=['GET', 'PUT'])
def index_one(qid):
    question_id = int(qid)
    question = Question.query.filter(Question.id == int(qid)).one_or_none()
    if request.method == 'GET':
        return({"question_answer_inputs": question.to_dict()})
    if request.method == 'PUT':
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        questio = request.json.get('question', None)
        answer = request.json.get('answer', None)
        inputs = request.json.get('inputs', None)
        is_public = request.json.get('isPublic', None)
        question.question = questio # or userd["email"]
        question.answer = answer
        question.inputs = inputs
        question.is_public = is_public
        question.updated_at = datetime.now()
        db.session.commit()
        return ({"message": "success"})
