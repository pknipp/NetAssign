[schema](https://drawsql.app/appacademy-2/diagrams/net_assign#)
tighten code (make uniform the useEffects) and insert comments
are back-end routes suitably REST-ful?
Are there any inputs for which one needs to input numbers starting w/decimal or "-"?
create a README
Create gradebook, for both instructor and student.
synthesize LogIn, SignUp, and EditUser, or perhaps just the latter two
Get 'x<sup>2</sup>' to render properly (using npm react-innertext package?)
For models.py, insert the many-to-many relationships?
Use eager loading rather than lazy loading
Ensure that answer is NEVER fetched for a student
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

Can "SUBMIT" button be removed from Submission.js, if logic is transferred from handleSubmit to onChange event handler, AND if putSubmission is allowed to take an argument?
Rename some components to reflect their function rather than first db Query?
Muse upon rationale for putting routes in different blueprints (and naming components)
When fetching lists from back-end, sort them in the most logical manner
Increase # of Question seeds
Determine how to handle a situation in which question is edited after assignment w/it is downloaded.
Provide means for an instructor to deploy (ie, schedule) an assignment from "Assignments"?
Ensure that whitespace is appropriately removed from input2s and fill-in-blank answer (in back or front?)
For fill-in-the-blank question in which you want to allow multiple correct answers, allow this somehow?
introduce MC questions (as a type of fill-in-the-blank?)
Insert an boolean in Deployment model (or Assignment?) which'll allow student to see answer key after deadline passes.
Insert additional columns (fname, lname, etc) in User model.
Insert an is_admin column in User model (and provide oversight of is_instructor boolean?)
