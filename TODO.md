[schema](https://drawsql.app/appacademy-2/diagrams/webassign#)
Question parsing:
synthesize LogIn, SignUp, and EditUser, or perhaps just the latter two
for questions, incorporate something like pickone/picksame
introduce MC questions
for models.py, insert the relationships
create Home component for both teacher and student, which should include courses
teacher should be enrolled in own course, right?
teacher should have submissions, right?
use faker to generate more seed material
in database.py, ensure that created_at dates are consistent between related models
change project name from mywebassign to myassign?

example:
```
// First create a string, which can be stored in db.
let str = `(x, y, z) => {
    return x + y * z;
}`;
// Second, use this string to create a function which takes 3 args.
let answer = new Function(`return ${str}`)();
// Third, use this function to build a question, its answer, and distractors.
