[schema](https://drawsql.app/appacademy-2/diagrams/webassign#)
Question parsing:
synthesize LogIn, SignUp, and EditUser, or perhaps just the latter two

example:
```
// First create a string, which can be stored in db.
let str = `(x, y, z) => {
    return x + y * z;
}`;
// Second, use this string to create a function which takes 3 args.
let answer = new Function(`return ${str}`)();
// Third, use this function to build a question, its answer, and distractors.
