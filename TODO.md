[schema](https://drawsql.app/appacademy-2/diagrams/my_assign#)
synthesize LogIn, SignUp, and EditUser, or perhaps just the latter two
for questions, incorporate something like pickone/picksame (will require bracket look-up)
introduce MC questions
Get 'x<sup>2</sup>' to render properly (using npm react-innertext package?)
For models.py, insert the many-to-many relationships?
Use eager loading rather than lazy loading
Go back and minimize amount of data in all fetches
Muse upon rationale for putting routes in different blueprints (and naming components)
In database.py, control created_at (= t1), updated_at (t2), and is_public (for both
    questions and assignments) and deadline as follows:
    (1)user(u): t2u > t1u
    (3)course (c): t2c > t1c > t1u, CUD
    (4)enrollment (e): te > t1c, te > t1u, CUD

    (2)question (q): t2q > t1q > t1u
    (5)assignment (as): t2as > t1as > t1u, t2as > t1q
    (6)appearances (ap): tap > t1q, tap > t1as, CUD

    (7)deployments (d): t2d > t1d > t1as, t1d > t1c, deadline > t2d, CU
    (8)submissions (s): deadline > t2s > t1s > t1u, t1s > t1d

Figure out (using list above?) how to seed other students w/a certain number of responses.
Use html tables to format lists of courses, assignments, and (possibly) questions.
Insert an is_admin boolean column in Users table
Insert addition columns (fname, lname, etc) in Users table?
Make sure that all front-end routes are protected by authContext
Create a gradebook (for students AND teachers).
Create instructor-editors for following tables: Assignment, Course, Deployment
Improve editor for following tables: Question
Rename some components to reflect their function rather than first db Query
Presently, Signup defaults to #is_instructor = False.  Figure out a way to deal with this.
On back-end, change some for-loops to list comprehensions.
For assignment-creation route, simultaneously create a row in the appearances table
Insert ability to duplicate questions and assignments
Figure out how to input deadline (type="datetime-local", for Deployment CU routes?)
