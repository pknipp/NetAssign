from random import randrange
# The first element of each tuple should be the url of a photo in AWS.
my_posts = [
    ("abc", "Cool dog!"),
    ("bca", "Love this one."),
    ("cab", "Yippee!"),
    ("cba", "Which one is the owner?")
    ]
n = randrange(len(my_posts))
print(my_posts[n])
