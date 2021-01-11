from flask import Blueprint, jsonify, request, redirect
from net_assign.models import Question, db, User, Assignment, Deployment
from datetime import datetime
from flask_login import current_user
from sqlalchemy import or_
from random import random, randint
import json

assignments = Blueprint('assignments', __name__)

@assignments.route('/', methods=['GET', 'POST'])
def index():
    user_id = current_user.id
    if request.method == 'GET':
        assignments = Assignment.query.filter(or_(Assignment.instructor_id == user_id, Assignment.is_public == True)).order_by(Assignment.id)
        assignment_list = list()
        for assignment in assignments:
            assignment = assignment.to_dict()
            author = User.query.filter(User.id == assignment["instructor_id"]).one_or_none().to_dict()
            assignment_list.append({"author": author, "assignment": assignment})
        return({"assignments": assignment_list})
        
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        new_assignment = Assignment(
            instructor_id=user_id,
            name=request.json.get('name'),
            is_public=request.json.get('isPublic'),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        # After getting new aid, figure out where to create & add a new enrollment
        db.session.add(new_assignment)
        db.session.commit()
        return ({"message": "success"})

@assignments.route('/<aid>', methods=['GET', 'PUT', 'DELETE'])
def index_one(aid):
    assignment_id = int(aid)
    assignment = Assignment.query.filter(Assignment.id == int(aid)).one_or_none()

    if request.method == 'GET':
        return({"assignment": assignment.to_dict()})
    if request.method == 'PUT':
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        assignment.name = request.json.get('name', None)
        assignment.is_public = request.json.get('isPublic', None)
        assignment.updated_at = datetime.now()
        db.session.commit()
        return ({"message": "success"})
    if request.method == 'DELETE':
        db.session.delete(assignment)
        db.session.commit()
        return {"message": "I hope that no one needs that assignment."}
