from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    can_follow = db.Column(db.Boolean, nullable=False)
    user_name = db.Column(db.String(40), nullable=False, unique=True)
    first_name = db.Column(db.String(40))
    last_name = db.Column(db.String(40))
    full_name = db.Column(db.String(60))
    DOB = db.Column(db.Date, nullable=False)
    email = db.Column(db.String(63))
    hashed_password = db.Column(db.String(100), nullable=False)
    website = db.Column(db.String(255))
    bio = db.Column(db.Text)
    phone = db.Column(db.Integer)
    gender = db.Column(db.String(31))
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @classmethod
    def authenticate1(cls, user_name, password):
        user = cls.query.filter(User.user_name == user_name).scalar()
        if user:
            return check_password_hash(user.hashed_password, password), user
        else:
            return False, None

    @classmethod
    def authenticate2(cls, email, password):
        user = cls.query.filter(User.email == email).scalar()
        if user:
            return check_password_hash(user.hashed_password, password), user
        else:
            return False, None

    posts = db.relationship(
        "Post", back_populates="user", cascade="all, delete-orphan"
    )
    comments = db.relationship(
        "Comment", back_populates="user", cascade="all, delete-orphan"
    )
    likes = db.relationship(
        "Like", back_populates="user", cascade="all, delete-orphan"
    )
    # follows = db.relationship(
    #    "Follow", back_populates="user")
    # figure out how to implement the following 4 lines w/out errors
    # follows = db.relationship("Follow", back_populates="user")
    # follows = db.relationship(
    #   "Follow", back_populates="user/follower/followed")
    # direct_messages = db.relationship(
    #   "DirectMessage", back_populates="user/sender/recipient")

    def to_dict(self):
        return {
            "can_follow": self.can_follow,
            "id": self.id,
            "user_name": self.user_name,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "full_name": self.full_name,
            "email": self.email,
            "DOB": self.DOB,
            "website": self.website,
            "bio": self.bio,
            "phone": self.phone,
            "gender":    self.gender,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class Follow(db.Model):
    __tablename__ = 'follows'

    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False
    )
    followed_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False
    )
    created_at = db.Column(db.DateTime, nullable=False)
    db.UniqueConstraint(follower_id, followed_id)

    # figure out how to insert back_populates="follows" into next 2 lines
    # follower = db.relationship("User", foreign_keys=[follower_id], back_populates="follows")
    # followed = db.relationship("User", foreign_keys=[followed_id], back_populates="follows")

    def to_dict(self):
        return {
            "id": self.id,
            "follower_id": self.follower_id,
            "followed_id": self.followed_id,
            "created_at": self.created_at,
        }


class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False
    )
    photo_url = db.Column(db.String(255))
    caption = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)

    user = db.relationship("User", back_populates="posts")
    comments = db.relationship(
        "Comment", back_populates="post", cascade="all, delete-orphan"
    )
    likes = db.relationship(
        "Like", back_populates="post", cascade="all, delete-orphan"
    )
    # insert relationship to user via likes or comments?

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "photo_url": self.photo_url,
            "caption": self.caption,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)

    user = db.relationship("User", back_populates="comments")
    post = db.relationship("Post", back_populates="comments")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "content": self.content,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }


class Like(db.Model):
    __tablename__ = 'likes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False
    )
    post_id = db.Column(
        db.Integer, db.ForeignKey("posts.id"), nullable=False
    )
    created_at = db.Column(db.DateTime, nullable=False)
    db.UniqueConstraint(user_id, post_id)

    user = db.relationship("User", back_populates="likes")
    post = db.relationship("Post", back_populates="likes")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "created_at": self.created_at,
        }


# The following needs to be configured.
class DirectMessage(db.Model):
    __tablename__ = 'direct_messages'

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False
    )
    recipient_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)

    # figure out how to insert back_populates=
    #   "direct_messages" into following 2 lines
    sender = db.relationship("User", foreign_keys=[sender_id])
    recipient = db.relationship("User", foreign_keys=[recipient_id])

    def to_dict(self):
        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "recipient_id": self.recipient_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
