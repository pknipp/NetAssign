from flask import Blueprint, jsonify, request, redirect
from net_assign.models import Question, db, User, Assignment, Deployment, Appearance
from datetime import datetime
from flask_login import current_user
from sqlalchemy import or_
from random import random, randint
import json
import cexprtk

assignments = Blueprint('assignments', __name__)
dec = 4

@assignments.route('', methods=['POST', 'GET'])
def index():
    user_id = current_user.id

    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"message": "Missing JSON in request"}), 400
        new_assignment = Assignment(
            instructor_id=user_id,
            name=request.json.get('name'),
            is_public=request.json.get('isPublic'),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_assignment)
        db.session.commit()
        return {"assignment": new_assignment.to_dict()}

    if request.method == 'GET':
        # Include boolean in re whether or not instructor has scheduled each assignment
        assignments = Assignment.query.filter(or_(Assignment.instructor_id == user_id, Assignment.is_public)).order_by(Assignment.id)
        assignment_list = list()
        for assignment in assignments:
            author = User.query.get(assignment.instructor_id)
            assignment_list.append({"author": author.to_dict(), "assignment": assignment.to_dict()})
        return {"assignments": assignment_list}

@assignments.route('/<assignment_id>', methods=['POST', 'GET', 'PUT', 'DELETE'])
def one(assignment_id):
    assignment_id = int(assignment_id)
    assignment = Assignment.query.get(assignment_id)
    appearances = Appearance.query.filter(Appearance.assignment_id == assignment_id)
    questions = [Question.query.get(appearance.question_id) for appearance in appearances]

# duplicating an assignment
    if request.method == 'POST':
        new_assignment = Assignment(
            instructor_id=current_user.id,
            name=assignment.name + '(COPY)',
            is_public=assignment.is_public,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_assignment)
        db.session.commit()
        for question in questions:
            new_appearance = Appearance(
                assignment_id=new_assignment.id,
                question_id=question.id,
                created_at=datetime.now()
            )
            db.session.add(new_appearance)
        db.session.commit()
        return {"message": "success"}

    if request.method == 'GET':
        question_list = list()
        for q_and_a_and_i in questions:
            question = q_and_a_and_i.question
            inputs = json.loads(q_and_a_and_i.inputs)
            answer = q_and_a_and_i.answer
            x = list()
            input_d = dict()
            for i in range(len(inputs)):
                x.append(round(inputs[i][0]+(inputs[i][1]-inputs[i][0])*randint(0, inputs[i][2])/inputs[i][2],dec))
                input_d["x" + str(i)] = x[i]
            question = question.format(*x)
            answer = round(cexprtk.evaluate_expression(answer, input_d),dec)
            question_list.append({"id": q_and_a_and_i.id, "question": question, "answer": answer})
        return {"assignment": assignment.to_dict(), "questions": question_list}

    if request.method == 'PUT':
        if not request.is_json:
            return jsonify({"message": "Missing JSON in request"}), 400
        assignment.name = request.json.get('name', None)
        assignment.is_public = request.json.get('isPublic', None)
        assignment.updated_at = datetime.now()
        db.session.commit()
        return {"message": "success"}

    if request.method == 'DELETE':
        db.session.delete(assignment)
        db.session.commit()
        return {"message": "I hope that no one needs that assignment."}
