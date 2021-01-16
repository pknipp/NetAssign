from flask import Blueprint, request, redirect
from net_assign.models import db, Assignment, Deployment, Course, Appearance
from datetime import datetime

appearances = Blueprint('appearances', __name__)

@appearances.route('/<aid_and_qid>', methods=['POST', 'GET', 'DELETE'])
def get_deployments(aid_and_qid):
    ids = aid_and_qid.split(" ")
    aid = int(ids[0])
    qid = int(ids[1])
    if request.method == 'POST':
        new_appearance = Appearance(
            assignment_id=aid,
            question_id=qid,
            created_at=datetime.now()
        )
        db.session.add(new_appearance)
        db.session.commit()
        return {"message": "created an appearance of a question on an assignment"}
    if request.method == 'DELETE':
        appearance = Appearance.query.filter(Appearance.assignment_id == aid).filter(Appearance.question_id == qid).one_or_none()
        db.session.delete(appearance)
        db.session.commit()
        return {"message": "successful deletion"}
