from flask import Blueprint, send_file, redirect, request
from petstagram.aws import list_files, download_file, upload_file
from datetime import datetime
from ..models import db, User, Post, Follow
import os
import time

following = Blueprint('following', __name__)

#get list of all following
@following.route('/<int:id>', methods=['GET', 'POST'])
def index(id):
    uid = int(id)
    if request.method == 'GET':
        get_following = Follow.query.filter(Follow.follower_id == uid).all()
        following_list = [following.followed_id for following in get_following]
        post_list = [
            Post.query.filter(Post.user_id == fid).order_by(Post.created_at.desc()).all()
            for fid in following_list
        ]
        pid_list = [
            [pid.id for post in post_list for pid in post]
        ]
        return {"following": following_list, "followerPosts": pid_list}

    if request.method == 'POST':
        followed_id = request.form['uid']

        new_follow = Follow(
                            follower_id=uid,
                            followed_id=followed_id,
                            created_at=datetime.now()
        )
        db.session.add(new_follow)
        db.session.commit()
        return 'posted'

#get user_id of following
#get list of posts with followers user ids
#sort posts by most recent created at date
#for each post in list , create clickable div that redirects to posts/pid
