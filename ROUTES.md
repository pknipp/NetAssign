# API Endpoints

1. Main:
    - GET / - All posts from accounts user follows

2. Blueprint: 'users', url_prefix = "/api/users"
    - GET /:id - Get all user info
    - POST / - Create new user
    - PUT /:id - Edit user info
    - DELETE /:id - Delete user

3. Blueprint: 'posts', url_prefix = "/api/posts"
    - GET /:id - Get one post
    - POST / - Create a new post
    - PUT /:id - Edit a post
    - DELETE /:id - Delete a post

4. Blueprint: 'comments', url_prefix = "/api/comments"
    - GET /:id - Get all comments for post at id
    - POST /:id - Comment on a post at id
    - DELETE /:id/:id2 - Delete comment(id2) from post at id

5. Blueprint: 'likes', url_prefix = "/api/likes"
    - GET /:id - Get all likes for post at id
    - POST /:id - Like a post at id
    - DELETE /:id - Unlike post at id

8. Blueprint: 'following', url_prefix = "api/following"
    - GET / - All accounts the user is following
    - POST / - Follow someone
    - DELETE / - unfollow someone

9. Blueprint: 'followers', url_prefix = "api/followers"
    - GET /:id - Get all followers for user
