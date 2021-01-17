from flask import Blueprint, jsonify, request, redirect
from flask_login import current_user
from net_assign.models import Question, db, User
from datetime import datetime
from sqlalchemy import or_
from random import random, randint
import cexprtk
import json

questions = Blueprint('questions', __name__)

@questions.route('/me', methods=['GET', 'POST'])
def me():
    user_id = current_user.id
    if request.method == 'GET':
        q_and_a_and_is = Question.query.filter(or_(Question.instructor_id == user_id, Question.is_public)).order_by(Question.id)
        questions = list()
        for q_and_a_and_i in q_and_a_and_is:
            author = User.query.filter(User.id == q_and_a_and_i.instructor_id).one_or_none()
            question = q_and_a_and_i.question
            answer   = q_and_a_and_i.answer
            inputs = q_and_a_and_i.inputs
            questions.append({"id": q_and_a_and_i.id, "author": author.to_dict(), "question": question, "answer": answer, "inputs": inputs, "is_public": q_and_a_and_i.is_public})
        return {"questions": questions}
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"message": "Missing JSON in request"}), 400
        new_question = Question(
            instructor_id=user_id,
            question=request.json.get('question'),
            answer=request.json.get('answer'),
            inputs=request.json.get('inputs'),
            is_public=request.json.get('isPublic'),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_question)
        db.session.commit()
        return {"message": "success"}

@questions.route('/<qid>', methods=['GET', 'PUT', 'DELETE', 'POST'])
def one(qid):
    question = Question.query.filter(Question.id == int(qid)).one_or_none()
    # duplicating a question
    if request.method == 'POST':
        new_question = Question(
            instructor_id=current_user.id,
            question=question.question,
            answer=question.answer,
            inputs=question.inputs,
            is_public=question.is_public,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_question)
        db.session.commit()
        return {"message": "success"}
    if request.method == 'GET':
        return({"question_answer_inputs": question.to_dict()})
    if request.method == 'PUT':
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        question.question = request.json.get('question', None)
        question.answer = request.json.get('answer', None)
        question.inputs = request.json.get('inputs', None)
        question.is_public = request.json.get('isPublic', None)
        question.updated_at = datetime.now()
        db.session.commit()
        return ({"message": "success"})
    if request.method == 'DELETE':
        db.session.delete(question)
        db.session.commit()
        return {"message": "I hope that no one needs that question."}
