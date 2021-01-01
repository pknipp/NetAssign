from flask import Blueprint, request, redirect
from petstagram.models import Comment, db, Post, Like
from datetime import datetime
from flask_login import current_user
from ..models import db, User, Post, Comment, Like

likes = Blueprint('likes', __name__)


@likes.route('/<id>', methods=['GET'])
def index(id):
    pid = int(id)
    if request.method == 'GET':
        get_likes = Like.query.filter(Like.post_id == pid).order_by(Like.created_at.desc()).all()
        like_count = len(get_likes)
        likes = [like.to_dict() for like in get_likes]

        # likes_count = len(likes)
        # likes_latest = Like.query.order_by(Like.created_at.desc()).first()
        return {"likes": likes, "count": like_count}


@likes.route('/<id>', methods=['DELETE'])
def del_likes(id):
    del_like = Like.query.filter(Like.id == id).delete()
    db.session.commit()
    return {"Deleted": "Deleted"}


@likes.route('/<currentUserId>/<postId>', methods=['POST'])
def add_likes(currentUserId, postId):

    print("WWWWWWWWEEEEEE HEEEERRRREEEE")
    created_at = datetime.now()
    like = Like(
                        user_id=currentUserId,
                        post_id=postId, 
                        created_at=created_at,
                               
        )
    db.session.add(like)
    db.session.commit()
    data = {
        'user_id': currentUserId,
        'post_id': postId, 
        'created_at': created_at,
    }
    return {'data': data}
