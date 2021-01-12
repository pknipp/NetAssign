import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager, \
    current_user, login_user, logout_user, login_required
from flask_migrate import Migrate
from net_assign.models import db, User, Question, Assignment, Appearance, Course
from net_assign.api.session import session
from net_assign.api.users import users
from net_assign.api.questions import questions
from net_assign.api.enrollments import enrollments
from net_assign.api.deployments import deployments
from net_assign.api.submissions import submissions
from net_assign.api.assignments import assignments
from net_assign.api.appearances import appearances
from net_assign.api.courses import courses
from net_assign.config import Config
from datetime import datetime


app = Flask(__name__)
login_manager = LoginManager(app)
migrate = Migrate(app, db)
app.config.from_object(Config)
app.register_blueprint(session, url_prefix='/api/session')
app.register_blueprint(users, url_prefix='/api/users')
app.register_blueprint(questions, url_prefix='/api/questions')
app.register_blueprint(enrollments, url_prefix='/api/enrollments')
app.register_blueprint(deployments, url_prefix='/api/deployments')
app.register_blueprint(submissions, url_prefix='/api/submissions')
app.register_blueprint(assignments, url_prefix='/api/assignments')
app.register_blueprint(appearances, url_prefix='/api/appearances')
app.register_blueprint(courses, url_prefix='/api/courses')
db.init_app(app)


# Does the following get used for anything?
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


# Application Security
CORS(app)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') else False,
        samesite='Strict' if os.environ.get('FLASK_ENV') else None,
        httponly=True)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')


@app.route('/restore')
def restore():
    # id = current_user.id if current_user.is_authenticated else None
    user = None if not current_user.is_authenticated else current_user.to_dict()
    if current_user:
        return {"current_user": user}
