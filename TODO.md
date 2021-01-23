[schema](https://drawsql.app/appacademy-2/diagrams/my_assign#)
synthesize LogIn, SignUp, and EditUser, or perhaps just the latter two
introduce MC questions (as a type of fill-in-the-blank?)
Get 'x<sup>2</sup>' to render properly (using npm react-innertext package?)
For models.py, insert the many-to-many relationships?
Use eager loading rather than lazy loading
Ensure that answer is NEVER fetched for a student
Muse upon rationale for putting routes in different blueprints (and naming components)
In database.py, control created_at (= t1), updated_at (t2), and is_public (for both
    questions and assignments) and deadline as follows:
    (1)user(u): t2u > t1u
    (3)course (c): t2c > t1c > t1u,
    (4)enrollment (e): te > t1c, te > t1u,

    (2)question (q): t2q > t1q > t1u,
    (5)assignment (as): t2as > t1as > t1u, t2as > t1q
    (6)appearances (ap): tap > t1q, tap > t1as,

    (7)deployments (d): t2d > t1d > t1as, t1d > t1c, deadline > t2d, CU (both need datatime)
    (8)submissions (s): deadline > t2s > t1s > t1u, t1s > t1d

Figure out (using list above?) how to seed other students w/a certain number of responses.
Use html tables to format lists of courses, assignments, and (possibly) questions.
Insert an is_admin column in User model (and provide oversight of is_instructor boolean?)
Insert additional columns (fname, lname, etc) in User model.
Make sure that all front-end routes are protected by authContext or back-end fetch
Create a gradebook (for students AND teachers).
Improve styling of question editor (and include info capsules)
Rename some components to reflect their function rather than first db Query?
Figure out how to input deadline (type="datetime-local", for Deployment CU routes?)
When fetching lists from back-end, sort them in the most logical manner
Increase # of Question seeds (but not until after broadening question format?)
Determine how to handle a situation in which question is edited after assignment w/it is downloaded.
In instructions for question editor, provide link to cexprtk page.
Somewhere in question editor, insert desired number of decimal places.
Provide means for an instructor to deploy (ie, schedule) an assignment. (From "Home" or "Assignments"?)
Ensure that whitespace is appropriately removed from inputs and question_code.
For fill-in-the-blank question in which you want to allow multiple correct answers, allow for multiple correct answers?
