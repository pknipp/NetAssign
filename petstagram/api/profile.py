from flask import Blueprint, send_file, redirect, request
from petstagram.aws import list_files, download_file, upload_file
from datetime import datetime
from ..models import db, User, Post, Comment, Like, Follow
import os
import time

profile = Blueprint('profile', __name__)

UPLOAD_FOLDER = 'uploads'
BUCKET = "petstagram"


@profile.route('/<username>')
def profile_page(username):
    print("****************************************************************&&&&&&&&&&&&&  username = ", username)
    # users = User.query.filter(User.user_name == username)
    users = User.query.filter(True).all()
    print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
    print(users)
    print("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    user = User.query.filter(User.user_name == username)[0]
    posts = Post.query.filter(Post.user_id == user.id).all()
    get_following = Follow.query.filter(Follow.follower_id == user.id).all()
    following_list = [following.followed_id for following in get_following]
    get_followed_by = Follow.query.filter(Follow.followed_id == user.id).all()
    followed_by_list = [
        followed_by.follower_id for followed_by in get_followed_by]

    # print(user)
    # return user.to_dict()
    return {
        "user": user.to_dict(),
        "posts": [post.to_dict() for post in posts],
        "following": following_list,
        "followers": followed_by_list
    }

# in progress


@profile.route('/following', methods=['POST'])
def follow():
    data = request.json
    new_follow = Follow(
        follower_id=data['follower_id'],
        followed_id=data['profile_id'],
        created_at=datetime.now()
    )
    db.session.add(new_follow)
    db.session.commit()
    return 'posted'


@profile.route('/unfollow', methods=['DELETE'])
def unfollow():
    data = request.json
    print(data)

    query = Follow.query.filter_by(
        follower_id=data['follower_id'],
        followed_id=data['profile_id'],
    ).first()
    db.session.delete(query)
    db.session.commit()
    return 'deleted'
# add followers and following to return and make modal for them on click in protected routes
# All users need a profile pic in db!!!!!!!!
# randomize created at for the good profiles, all from the same user are lumped together
# main profiles need profilespics of that actual animal
# line 18 in following.py theres an 'fid' being used in a query but I didnt see it declared anywhere
