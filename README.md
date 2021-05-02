![NetAssign](question_editor.png)



# Contents

[schema](https://drawsql.app/appacademy-2/diagrams/net-assign)

[Heroku deployment](https://net-assign.herokuapp.com)

[Introduction](#introduction)

[Instructor/student dichotomy](#instructor/student-dichotomy)

[Question editor](#question-editor)

[CRUD](#crud)

[Gradebook](#gradebook)

# Introduction

[return to "Contents"](#contents)

[go to next section ("Instructor/student dichotomy")](#instructor/student-dichotomy)

My project (NetAssign) is a clone of [WebAssign](http://www.webassign.net), a leader in the delivery, administration, and automated grading of online assignments to students in high school and college.  This industry sector has revolutionized the manner in which classroom assignments are implemented this century.  My clone uses JavaScript and React (with functional components, hooks, and context) for the front-end, and it uses Flask, Python, SQLAlchemy, and PostgreSQL for the back-end.

# Instructor/student dichotomy

[return to "Contents"](#contents)

[return to previous section](#introduction)

[go to next section ("Question editor")](#question-editor)

This app has two different types of users (instructors and students), with considerably different capabilities and UX.  In the Users table of database these types are distinguished simply by the boolean value in the <tt>isInstructor</tt> column.  An instructor have full CRUD-control for each of the seven other tables in the db, whereas a student has no access to the Questions table and has complete access only to the row(s) of the Users, Enrollments, and Submissions tables for which either the primary or foreign key coincides with that of the student.  The initial <tt>Welcome</tt> component invites the unregistered visitor to self-designate as a <tt>userType</tt> which is either <tt>instructor</tt> or <tt>student</tt> by selecting the appropriate <tt>NavLink</tt>.
(NOTE: in progress is a method for a sysadmin to monitor/approve instructor-designation after the signup phase.)

from the <tt>NavBar</tt> component:
```
const userTypes = ["instructor", "student"];
const UserTypes = userTypes.map(userType => userType[0].toUpperCase() + userType.slice(1));
// ... and later ...
const noUserType = (
    <>
        {UserTypes.map(UserType => (
            <NavLink exact to={`/welcome${UserType}`}>
                {`${UserType}s`}
            </NavLink>
        ))}
    </>
);
// ... and later ...
return (
    <div className="nav-container">
        {head}
        <div>
            {!userType ? noUserType : // ...
        </div>
    </div>
)
```
This selection passes through these three children of the the <tt>Switch</tt> element in the <tt>App</tt> component in order to update the value of <tt>props.userType</tt>:
```
<AuthRoute exact path="/welcome" component={Welcome} />
<AuthRoute exact path="/welcomeInstructor" userType={"instructor"} component={Welcome} />
<AuthRoute exact path="/welcomeStudent" userType={"student"} component={Welcome} />
```
The updated props in the <tt>Welcome</tt> component causes the display of the value of the appropriate property of the <tt>welcome</tt> POJO, thereby displaying more specialized "welcome" information:
```
const Welcome = props => {
  const { userType, setUserType } = useContext(AuthContext);
  setUserType(props.userType);
  return (
    <div className="info text">
    // "welcome" POJO has two properties: "instructor" and "student"
        {welcome[props.userType] || general}
      </div>
  );
}
```
Different versions of the <tt>NavBar</tt> then guide the unregistered user to sign-up in the appropriate <tt>userType</tt>: <tt>instructor</tt> or <tt>student</tt>:
```
const i = userTypes.indexOf(userType);
const yesUserType = (
    <>
        <NavLink to={`/login${UserTypes[i]}`} className="nav" activeClassName="active">
            Login In
        </NavLink>
        <NavLink to={`signup${UserTypes[i]}`} className="nav" activeClassName="active">
            Sign Up
        </NavLink>
        <NavLink to={`/welcome${UserTypes[(i + 1) % 2]}`} className="nav">
            Switch to {`Switch to ${UserTypes[(i + 1) % 2]} Side`}
        </NavLink>
    </>
)
/// ... and later, with more details than before:
return (
    <div className="nav-container">
        {head}
        <div>
            {!userType ? noUserType : !currentUser ? yesUserType : // ...
        </div>
    </div>
)
```
After logging in or signing up, the user is then provided access to non-<tt>Auth</tt> routes.  From this point onward in the user experience, three different mechanisms prevent students from accessing resoures to which they are not authorized, the first two in the front-end and the third one in the back.  All of these hinge on the value of the <tt>is_instructor</tt> column in the Users table of the database.

(1) <tt>Route</tt> wrappers:
```
const ProtectedInstructorRoute = ({ component: Component, path, exact }) => {
    const { currentUser } = useContext(AuthContext)
    return (
        <Route
            path={path}
            exact={exact}
            render={props => (currentUser && currentUser.is_instructor)
                    ? <Component currentUser={currentUser} />
                    : <Redirect to="/login" />
            }
        />
    )
}
```
(2) conditional rendering of buttons and other resources:

The following code from the <tt>Enrollments</tt> component allows a student to drop a course but additionally allows an instructor both to edit the course details and to see the course's roster.  (For obvious reasons this code also prevents an instructor from withdrawing from the course.)
```
{currentUser.is_instructor ?
    <>
        <NavLink to={`/courses/edit/${course.course.id}`}>
            edit
        </NavLink>
        <NavLink to={`/roster/${course.course.id}`}>
            roster
        </NavLink>
    </>
:
    <button onClick={e => deleteEnrollment(e, currentUser.id, course.id)}>
        Drop
    </button>
}
```

(3) conditional early returns from back-end:

The following lines are from the back-end route <tt>deployments.py</tt>.
```
instructor_id = Course.query.get(course_id).instructor_id
if not instructor_id == current_user.id:
    return {"errors": ["You are not authorized to this."]}, 401
```

# Question editor

[return to "Contents"](#contents)

[return to previous section ("Instructor/student dichotomy")](#instructor/student-dichotomy)

[go to next section ("CRUD")](#crud)

NetAssign presently allows for two different categories of questions: "numerical" and "fill in the blank".  (The latter includes "true-false".)  Both categories use of a simple input element:
```
<input
    type="text"
    placeholder="Response"
    value={response}
    onChange={e => setResponse(e.target.value)}
/>
```
The two question-types differ in terms of how the student-response is handled (ie "graded") in the back-end.  Below are the relevant lines from <tt>submissions.py</tt>, the back-end route for student submissions (ie, responses to questions):
```
tolerance = 0.02
    # five lines omitted for the sake of brevity
    if request.method == 'PUT':
        # ten lines omitted for brevity
        grade = None  # declared in an outer scope
        if response != None:
            if isinstance(answer, str): # fill-in-the-blank question
                grade = (answer == response)
            else: # numerical question
                grade=abs(answer-float(response))<=tolerance*abs(answer) or abs(answer-float(response))<tolerance
```
As indicated above, the data-type of the answer (key) is a string for fill-in-the-blank but is a number for a numerical question.  A response to a fill-in-the-blank question is marked correct if and only if the student response exactly matches the answer.  However a response to a numerical question is marked correct either if the student's reponse is within 2% of the answer or is within 0.02 of the answer.

One of the most powerful features of NetAssign (and WebAssign) is its ability to randomize questions and their answers.  This feature assures instructors that their students not simply copying answers from each other.  Accordingly the <tt>Questions</tt> table of of the database does not simply contain one column with a simple string for the question and another column with a simple string (or number) for the correct answer.  Instead there are three separate columns: <tt>question_code</tt>, <tt>inputs</tt>, and <tt>answer_code</tt>, which I'll now discuss in turn.
1. <tt>question_code</tt>:

This is a string with both regular text and zero or more instances of brace-pairs, each containing a string with the name of a variable which'll be randomized in a manner specified by the contents of the <tt>inputs</tt> column.  Below are three examples of this, taken from the seeder data in <tt>database.py</tt>
```
"T or F: {animal} have four legs."
"{factor1} times {factor2} equals ... "
"What is the {power}th power of the {ordinal}th prime number?"
```
2. <tt>inputs</tt>:

Each of these is a <tt>JSON.stringify</tt>-ed multi-dimensional array, the dimension for which is either three or two depending upon the type of randomization.  Consider the following example, which corresponds to the last of the three examples above, and which involves both types of randomization:
```
[['power', 4, 7, 3], [['ordinal', 4, 5, 6, 7], ['prime', 7, 11, 13, 17]]]
```
The outer array contains two elements because there are two different randomizations which must be performed.  I'll consider these one element at a time.

The first element is a flat array. This signifies that the variable <tt>power</tt> should randomly receive 3 + 1 = 4 different values which are spread evenly between a minimum value of 4 and a maximum value of 7.
```
['power', 4, 7, 3]
```
Hence, <tt>power</tt> should be randomly chosen from the set {4, 5, 6, 7} (using notation from mathematics, not JavaScript).

Next consider the second element in <tt>inputs</tt>, which consists of a two-dimensional array. This signifies that there are two or more variables, which must be chosen in a correlated manner.
```
[['ordinal', 4, 5, 6, 7], ['prime', 7, 11, 13, 17]]
```
The two sub-subarrays each have of length *N* + 1, where *N* is the number of different randomized values that these variables should assume.  The zeroth element of each sub-subarray is the name of the particular variable, and the remaining *N* elements (which themselves need *not* be numbers) are the values that the particular variable may assume.  Note that these randomizations occur in a correlated manner.  For instance, if <tt>ordinal</tt> equals 5, then <tt>prime</tt> equals 11.  (ie, the 5th prime number is 11.)

In this particular example there is exactly one instance of the first type of randomization and one instance of the second type of randomization, but there can be any combination of the different types of randomizations.

3. <tt>answer_code</tt>:

This is a string.  For a fill-in-the-blank question this simply corresponds to the answer.  For a numerical question, however, this string is a mathematical/algebraic/trigonometric expression which provides the answer.  The syntax used is both intuitive and powerful.  It probably includes the names of your variables (not enclosed with braces), parentheses, and operators such as +, -, *, /, and/or ^ (for exponentiation).
Click <a href="http://www.partow.net/programming/exprtk">
www.partow.net/programming/exprtk</a> for more details.  For the second and third examples given at the top of this section, what follows are the respective strings for the <tt>answer_code</tt>:
```
"factor1 * factor2"
 "prime^power"
 ```

# CRUD

[return to "Contents"](#contents)

[return to previous section ("Question editor")](#question-editor)

[go to next section ("Gradebook")](#gradebook)

In addition to the usual CRUD functionality, the table below includes a column ("Du") for the process of duplicating an existing row of a table in the database (which mimics the "Save As" functionality of most desktop applications).  Because there are no columns in the Appearances, Deployments, and Submissions tables other than the primary key, the foreign keys, and the created_at and updated_at moments, these three tables have no need for U functionality.  Deployments, the only other joins table, has a "deadline" column which may be updated.  There is no "delete" functionality for the Submissions table for the simple reason that each row is part of the student's permanent record.

Table | Du | C | R | U | D | Joins?
------| ---- | --| - | - | - | -
Users | N    | Y | Y | Y | Y | N
Questions| Y | Y | Y | Y | Y | N
Courses| Y| Y| Y | Y | Y | N
Assignments| Y| Y | Y | Y | Y | N
Enrollments| N| Y | Y | N | Y | Users and Courses
Appearances| N| Y | Y | N | Y | Questions and Assignments
Deployments| Y| Y | Y | Y | Y | Assignments and Courses
Submissions| N| Y*| Y | Y | N | Deployments and Users

*A row in the Submissions table is created automatically when the particular user first views the deployment.

The event-handler for any of these actions starts with the string "<tt>duplicate</tt>" or the lower-case spelling of the HTTP verb (POST, GET, PUT, DELETE), followed by the name of the table in either plural or singular form as appropriate.
Most of these handlers are found in a component by the same name as the table, or are in a component with the singular form of this name and with the prefix "Edit", but that pattern is not universal.  The <tt>fetch</tt> <tt>method</tt> used for each of the handlers is self-explanatory, except for the ones which duplicate resources.  For those I use the <tt>POST</tt> method, but I include params which equal the primary key of the resource being duplicated.  (For regular "post" handlers I either do not include params, or I set the params to zero.)  As an example, below are shown these handlers for such changes to the Questions table.  Note that the <tt>fetch</tt> call for the <tt>duplicate</tt> handler does not need a body, because those data are readily available at the back end, given that the params contains the primary key of the original being copied.
```
const postQuestion = async () => {
    const response = await fetchWithCSRF(`/api/questions`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            questionCode,
            answerCode,
            inputs: [...inputs1, ...inputs2],
            isPublic
        })
    });
    // remaining 4 lines of event-handler omitted for brevity

const duplicateQuestion = async () => {
    const response = await fetchWithCSRF(`/api/questions/${questionId}`, {
        method: 'POST',
    });
    // remaining 4 lines omitted
```
Of course the back-end routes accommodate this distinction.

Earlier in the process, I use this same "truthiness vs falsi-ness of params" approach to distinguish between duplication and posting in front-end routes, also.  Below are the links for question creation and duplication, respectively.

in the <tt>Questions</tt> component:
```
<NavLink exact to={"/questions/0"} className="nav" activeClassName="active">
    create new question
</NavLink>
```

in the <tt>Question</tt> component (with removal of some tangential details):
```
<NavLink exact to={`/questions/${question.id}`} className="nav" activeClassName="active">
    duplicate
</NavLink>
{question.question}
```

Most of the components contain a <tt>useEffect</tt> invocation of a <tt>get</tt> handler.  Exceptions to this pattern include the <tt>Question/Assignment/ToggleInfo/Welcome/Route/Input</tt> components (to each of which is threaded an adequate supply of <tt>props</tt>), the <tt>EditUser/Login/Logout/Signup/NavBar</tt> components (each of which either does not require data or gets its data from context), and the <tt>EditSubmission</tt> component (which contains a <tt>useEffect</tt> invocation of a <tt>put</tt> handler, for technical reasons).

# Gradebook

[return to "Contents"](#contents)

[return to previous section ("CRUD")](#crud)

UNDER CONSTRUCTION
