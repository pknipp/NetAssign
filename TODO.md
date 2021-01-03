[schema](https://drawsql.app/appacademy-2/diagrams/webassign#)
are props NOT needed for Edituser and Logout, because of context?
synthesize LogIn, SignUp, and EditUser, or perhaps just the latter two
for questions, incorporate something like pickone/picksame
introduce MC questions
for models.py, insert the relationships
teacher should have submissions, right?
use faker to generate more seed material
in database.py, ensure that created_at dates are consistent between related models
change project name from mywebassign to myassign?
eager loading rather than lazy loading
muse upon rationale for putting routes in different blueprints (and naming components)
change "Teacher" to "Instructor" to leave open higher-ed possibility
remove period from end of fake words used for Assignment names

example:
```
// First create a string, which can be stored in db.
let str = `(x, y, z) => {
    return x + y * z;
}`;
// Second, use this string to create a function which takes 3 args.
let answer = new Function(`return ${str}`)();
// Third, use this function to build a question, its answer, and distractors.
