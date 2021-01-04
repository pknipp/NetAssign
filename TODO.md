[schema](https://drawsql.app/appacademy-2/diagrams/webassign#)
synthesize LogIn, SignUp, and EditUser, or perhaps just the latter two
for questions, incorporate something like pickone/picksame
introduce MC questions
for models.py, insert the relationships
teacher should have submissions, right?
generate seed material for Submissions table (actually, this table doesn't get populated until first download)
in database.py, ensure that created_at dates are consistent between related models
change project name from mywebassign to myassign?
eager loading rather than lazy loading
muse upon rationale for putting routes in different blueprints (and naming components)
change "Teacher" to "Instructor" to leave open higher-ed possibility
remove period from end of fake words used for Assignment names
do a realistic deadline for deployments
include deployment deadline in info fetched w/assignments (for a class)
insert an isAdmin boolean column in Users table
make sure that all front-end routes are protected by authContext
understand whether *all() is required on back-end queries
round-off some of the numbers which appear in questions and answers
