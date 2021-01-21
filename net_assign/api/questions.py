from flask import Blueprint, jsonify, request, redirect
from flask_login import current_user
from net_assign.models import Question, db, User
from . import version
from datetime import datetime
from sqlalchemy import or_
from random import random, randint
import cexprtk
import json

questions = Blueprint('questions', __name__)

@questions.route('', methods=['POST', 'GET'])
def me():
    user_id = current_user.id

    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"message": "Missing JSON in request"}), 400
        new_question = Question(
            instructor_id=user_id,
            question_code=request.json.get('questionCode'),
            answer_code=request.json.get('answerCode'),
            inputs=json.dumps(request.json.get('inputs')),
            is_public=request.json.get('isPublic'),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_question)
        db.session.commit()
        return {"message": "success"}

    if request.method == 'GET':
        q_and_a_and_is = Question.query.filter(or_(Question.instructor_id == user_id, Question.is_public)).order_by(Question.id)
        questions = list()
        for q_and_a_and_i in q_and_a_and_is:
            owner = User.query.get(q_and_a_and_i.instructor_id)
            question_code = q_and_a_and_i.question_code
            answer_code   = q_and_a_and_i.answer_code
            inputs = json.loads(q_and_a_and_i.inputs)
            q_and_a = version.version(question_code, inputs, answer_code)
            question = q_and_a["question"]
            answer = q_and_a["answer"]
            questions.append({"id": q_and_a_and_i.id, "owner": owner.to_dict(), "question_code": question_code, "answer_code": answer_code, "inputs": inputs, "is_public": q_and_a_and_i.is_public, "question": question, "answer": answer})
        return {"questions": questions}

@questions.route('/<qid>', methods=['POST', 'GET', 'PUT', 'DELETE'])
def one(qid):
    question = Question.query.get(int(qid))

    # duplicating a question
    if request.method == 'POST':
        new_question = Question(
            instructor_id=current_user.id,
            question_code=question.question_code,
            answer_code=question.answer_code,
            inputs=question.inputs,
            is_public=question.is_public,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_question)
        db.session.commit()
        return {"message": "success"}

    if request.method == 'GET':
        question.inputs = json.loads(question.inputs)
        q_and_a = version.version(question.question_code, question.inputs, question.answer_code)
        question = question.to_dict()
        question["question"] = q_and_a["question"]
        question["answer"] = q_and_a["answer"]
        return(question)

    if request.method == 'PUT':
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        question.question_code = request.json.get('questionCode', None)
        question.answer_code = request.json.get('answerCode', None)
        question.inputs = json.dumps(request.json.get('inputs', None))
        question.is_public = request.json.get('isPublic', None)
        question.updated_at = datetime.now()
        db.session.commit()
        return ({"message": "success"})

    if request.method == 'DELETE':
        db.session.delete(question)
        db.session.commit()
        return {"message": "I hope that no one needs that question."}
