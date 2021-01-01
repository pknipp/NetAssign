from petstagram.models import User, Post, Comment, Like, Follow
from petstagram import app, db
from dotenv import load_dotenv
from datetime import date, datetime, timedelta
from faker import Faker
from random import randrange, seed, random
from werkzeug.security import generate_password_hash, check_password_hash

seed(1)
fake = Faker()
load_dotenv()

# can_follow    user_name	full_name	email
users = [
    (True,"dougthepug", "Douglas Puglas", "dougie@aol.com"),
    (True,"popeyethefoodie", "Popeye Canine", "popI@gmail.com"),
    (True, "TheOfficialGrumpyCat", "Feline Domesticus", "grump@felines4ever.net"),
    (True, "amysimbaandmilo", "Amy, Simba, and Milo", "asm@all3OfUs.com"),
    (True, "Reagandoodle", "Reagan B. Worthington IV", "reagan.worthington@theEstates.org"),
    (True, "mrpokee", "Pokee Much", "pokee@hogHeaven.net"),
    (True, "JoeCool", "Joe", "joe@k9.org"),
    (False, "goldenGlam", "Glam", "glam@gmail.com"),
    (False, "GoldenFive", "DreamTeam", "five.goldens@aol.com"),
    (False, "hector", "Hector", "hector@comcast.com"),
    (False, "winston", "Winston", "winston@myDog.org"),
    (False, "hercules", "Hercules", "hercules@myK9.org"),
    (False, "gertrude491", "Gertrude", "gertie@myPet.com"),
    (False, "MuttAndJeff", "Mutt and Jeff", "doggie2@myDog.net"),
    (False, "houdini393", "Houdini", "houdini.dachsund@aol.com"),
    (False, "PicklesTheCat", "Pickles", "picklepuss@gmail.com")
]

posts = [
    ("FriOct302019202020.png", 1, "Baby Yoda"),
    ("SunNov11332182020.png", 1, "Ahh ... the Big Apple!"),
    ("SunNov11334492020.png", 1, "Please meet my green-eyed friend."),
    ("SunNov11335522020.png", 1, "Can you tell how much I'm loved?"),
    ("FriOct302023292020.png", 2, "Not feeling so bad about being extra fluffy when you realize you’re not the only one."),
    ("FriOct302140482020.png", 3, "I WANT CHOCOLATE!"),
    ("FriOct302146372020.png", 4, "Snacking with my bud."),
    ("FriOct302149462020.png", 5, "Can you tell which one is ME?"),
    ("FriOct302152322020.png", 1, "Bad && Bougie"),
    ("FriOct302155302020.png", 2, "'Excuse me... is this with soy milk?' Just kidding, Popeye would never..."),
    ("FriOct302158132020.png", 3, "You KNOW that I don't like baths..."),
    ("FriOct302201142020.png", 4, "Who do you think is the tallest?"),
    ("FriOct302204202020.png", 5, "Yoga, anyone? Namaste right here on the couch."),
    ("FriOct302206472020.png", 1, "Can we watch spooky movies all day?"),
    ("FriOct302210052020.png", 2, "'You got this.' In case you needed some motivational words today..."),
    ("FriOct302212512020.png", 4, "We promise to gas it up before we return home."),
    ("FriOct302214352020.png", 5, "scarf weather"),
    ("FriOct302218142020.png", 6, "Ah ... fall."),
    ("FriOct302220302020.png", 1, "I think that I'm Fall'n for you."),
    ("FriOct302222302020.png", 2, "Send beer ASAP."),
    ("FriOct302224422020.png", 3, "I dare you to say that to my face."),
    ("FriOct302227052020.png", 4, "Since you are already up, how about bringing us some milk?"),
    ("FriOct302230002020.png", 5, "Every cowdog needs a horse, needs a horse ..."),
    ("FriOct302233012020.png", 1, "My third tall skinny today."),
    ("FriOct302234562020.png", 2, "fish & chips ftw"),
    ("FriOct302237342020.png", 4, "Siamese triplets?  I think NOT."),
    ("FriOct302239502020.png", 1, "Can you tell which one is me?"),
    ("FriOct302242412020.png", 2, "I think that I just sat on an acorn."),
    ("FriOct302245052020.png", 4, "Who's that other guy?"),
    ("FriOct302247352020.png", 1, "If you've got it, flaunt it!"),
    ("FriOct302255392020.png", 3, "Did you see a mouse walk past here a few minutes ago?"),
    ("FriOct302257502020.png", 5, "I smell gum."),
    ("FriOct302259492020.png", 2, "This is worth rolling of bed for, I suppose."),
    ("SatOct310933352020.png", 7, "The future's looking bright ..."),
    ("SatOct310939302020.png", 8, "Please pass the soap."),
    ("SatOct310942492020.png", 9, "I was here first!"),
    ("SatOct310945022020.png", 10, "I can hardly handle all of this stress!"),
    ("SatOct310946482020.png", 11, "Do I dare?"),
    ("SatOct310948522020.png", 12, "Don't believe everything that you read."),
    ("SatOct310951162020.png", 13, "... as long as she doen't put me in the overhead compartment (again!)."),
    ("SatOct310953542020.png", 14, "Time for a jump in the pond!"),
    ("SatOct310956552020.png", 15, "My latest trick: levitation."),
]

comments = [
    "OMG this is so cute!",
    "Can't believe you're in town",
    "Looking good!",
    "We should definitely meet up for kibble",
    "You're glowing...",
    "Living your best life I see",
    "You are absolutely stunning!!",
    "GOALSSSS!!",
    "My best friend is a model yall!!",
    "This is art",
    "You're such an inspiration to me",
    "We should definitely do brunch again some time, that was so fun!!",
    "Coolest kids on the block",
    "LOL you should frame this",
    "You are the cutest!!",
    "Definitely digging this look",
    "You are definitely working too hard",
    "FTW!", "OMG!", "SMH", "LMAO", "WTH?", "ROFL", "You haven't aged a minute since I last saw you.",
    "I barely even recognize you!", "You are an inspiration to us all.", "John 3:16"
]

with app.app_context():
    db.drop_all()
    db.create_all()
    # number of users, including demo_user
    n_user = len(users)
    # created_at = datetime(2000, 1, 15)
    # db.session.add(User(
    #     user_name="demo_user",
    #     first_name="Demo",
    #     last_name="User",
    #     full_name="Demo User",
    #     DOB=datetime(1980, 10, 31),
    #     password="password",
    #     email="demo@user.com",
    #     created_at=created_at,
    #     updated_at=datetime(2005, 2, 25),
    # ))

    user_t = []
    for user in users:
        DOB = fake.date_between(start_date="-20y")
        created_at = fake.date_time_between(start_date=DOB)
        user_t.append(created_at)
        db.session.add(User(
            can_follow=user[0],
            user_name=user[1],
            first_name=user[2],
            last_name=user[2],
            full_name=user[2],
            email=user[3],
            DOB=DOB,
            password="password",
            created_at=created_at,
            updated_at=fake.date_time_between(start_date=created_at)
        ))
    db.session.commit()

with app.app_context():

    # avg number of posts per user
    #n_post_per_user = 0
    n_post = len(posts)

    post_t = []
    for post in posts:
        user_id = post[1]
        created_at = fake.date_time_between(
            start_date=user_t[user_id - 1]
        )
        post_t.append(created_at)
        db.session.add(Post(
            user_id=user_id,
            photo_url="https://petstagram.s3.us-east-2.amazonaws.com/uploads/" + post[0],
            created_at=created_at,
            updated_at=created_at,
            caption=post[2],
        ))

    db.session.commit()
with app.app_context():

    # avg number of comments per post
    n_comment_per_post = 3
    n_comment = n_post * n_comment_per_post

    for _ in range(n_comment):
        comment_t = []
        user_id = randrange(n_user)
        post_id = randrange(n_post)
        t_user = user_t[user_id]
        t_post = post_t[post_id]
        latest_t = t_user if t_user < t_post else t_post
        created_at = fake.date_time_between(start_date=latest_t)
        comment_t.append(created_at)
        db.session.add(Comment(
            user_id=user_id + 1,
            post_id=post_id + 1,
            created_at=created_at,
            updated_at=created_at,
            content=comments[randrange(len(comments))]
        ))
    db.session.commit()

with app.app_context():
    # probability of a user liking a post:
    like_prob = 0.5
    like_t = []
    for user_id in range(n_user):
        t_user = user_t[user_id]
        for post_id in range(n_post):
            t_post = post_t[post_id]
            if random() < like_prob:
                later_t = t_post if t_post > t_user else t_user
                created_at = fake.date_time_between(start_date=later_t)
                like_t.append(created_at)
                db.session.add(Like(
                    user_id=user_id + 1,
                    post_id=post_id + 1,
                    created_at=created_at,
                ))
    db.session.commit()

with app.app_context():
    # probability of one user following another:
    follow_prob = 0.5
    follow_t = []
    for follower_id in range(n_user):
        t_follower = user_t[follower_id]
        for followed_id in range(n_user):
            t_followed = user_t[followed_id]
            if random() < follow_prob and not follower_id == followed_id:
                later_t = t_followed if t_followed > t_follower else t_follower
                created_at = fake.date_time_between(start_date=later_t)
                follow_t.append(created_at)
                db.session.add(Follow(
                    follower_id=follower_id + 1,
                    followed_id=followed_id + 1,
                    created_at=created_at,
                ))
    db.session.commit()
