[schema](https://drawsql.app/appacademy-2/diagrams/my_assign#)
synthesize LogIn, SignUp, and EditUser, or perhaps just the latter two
for questions, incorporate something like pickone/picksame
introduce MC questions
for models.py, insert the relationships
instructor should have submissions, right?
in database.py, ensure that created_at dates are consistent between related models
eager loading rather than lazy loading
muse upon rationale for putting routes in different blueprints (and naming components)
remove period from end of fake words used for Assignment names
do a realistic deadline for deployments
include deployment deadline in info fetched w/assignments (for a class)
insert an isAdmin boolean column in Users table
make sure that all front-end routes are protected by authContext
understand whether *all() and/or #one_or_none() is required on back-end queries
replace "right" and "wrong" w/red & green marks
don't display "right" vs "wrong" if they've not yet answered
ensure that "right" shows up if it's stored correctly in db, even before clicking "submit"
    (Would this require useEffect?)
Change default correctness to be relative (= 0.02) rather than absolute
If currentUser.isInstructor, fetch&display the answers.
