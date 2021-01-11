from flask import Blueprint, request, redirect
from net_assign.models import db, Assignment, Deployment, Course, Appearance
# from flask_login import login_required, logout_user, login_user, current_user

appearances = Blueprint('appearances', __name__)

@appearances.route('/<aid_and_qid>', methods=['DELETE'])
def get_deployments(aid_and_qid):
    ids = aid_and_qid.split(" ")
    aid = int(ids[0])
    qid = int(ids[1])
    if request.method == 'DELETE':
        appearance = Appearance.query.filter(Appearance.assignment_id == aid).filter(Appearance.question_id == qid).one_or_none()
        db.session.delete(appearance)
        db.session.commit()
        return {"message": "successful deletion"}
