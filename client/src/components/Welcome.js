import React, { useContext } from 'react';
import AuthContext from "../auth";
import info from "../info.png";
import cancel from "../cancel.jpeg";

const general = (
  <>
    <div>Traditional homework has looked like the following:</div>
    <div>
    <ul>
      <li>Instructor hands assignment sheet to the student.</li>
      <li>Student attempts to answer the first question on the assignment.</li>
      <li>Student attempts the next question without knowing how well he/she answered the previous question.
      <li>This continues for the rest of the assignment.</li>
      <li>Student hands the assignment to the instructor.</li>
      <li>Instructor grades the assignment.</li>
      <li>Instructor enters this grade into his/her gradebook.</li>
      <li>Instructor hands the graded assignment back to the student.</li>
      <li>Student learns from his/her mistakes, if any.</li>
      <li>Depending upon course policy, the student resubmits his/her assignment, and the process repeats until the   student has learned the material.</li>
      </li>
    </ul>
    </div>
    <div>This clumsy practice is now being replaced by services such as WebAssign which streamline the process by automating the distribution, administration, and grading of assignments and thereby tightening the feedback loop which is so important to teaching and learning.  Such services are used for in-person classes but - with the present pandemic - their importance is much greater for remote instruction.</div>

    <div>Please click a link above in order to investigate NetAssign, my clone of WebAssign.</div>
  </>
)

const student = (
  <div>
    <div>If you do your coursework with NetAssign ...</div>
    <ul>
      <li>you will receive immediate feedback as to the correctness of responses,</li>
      <li>you will - depending upon course policy -
        be allowed to submit an improved response in order to assess the extent to which you have learned from any mistake (although we recommend that you first take the time to understand fully the nature of the mistake), and </li>
      <li>after the assignment's deadline you can see the correct answers to all questions, including those which you never answered correctly.</li>
    </ul>
    <div>NOTE: any classmate will probably receive a different ("randomized") version of the the question from you, so any collaboration between you and that classmate must be on a "higher level", i.e. sharing concepts and approaches rather than simply numbers or words.</div>

    <div>Please click a link above in order either to login as a demo student or to signup as a new user, each of which will allow you to gain a greater view of the student side of NetAssign.</div>

  </div>
  );

  const instructor = (
    <div>
      <div>If you do your coursework with NetAssign,</div>
      <ul>
        <li>you can easily share questions with other instructors who use the service,</li>
        <li>because of question randomization you'll know that your students are not simply copying answers from each other,</li>
        <li>you can track the progress of the work performed by any student or course in order to determine if there are any "mid-course" corrections which you need to make in your instruction,</li>
        <li>you can make changes to the assignment - if needed - between its start date and deadline,</li>
        <li>you don't need to spend hours grading every week, and</li>
        <li>student grades are automatically stored in the database.</li>
      </ul>
      <div>Please click a link above in order either to login as a demo instructor or to signup as a new user, each of which will allow you to gain a greater view of the instructor side of NetAssign.</div>

      <div>NOTE: As you navigate through NetAssign there will be places where you can click '<img src={info} alt="Show information." />/<img src={cancel} alt="Hide information." />' in order to toggle the display of information about various details.</div>
    </div>
  );

const Welcome = props => {
  const { userType, setUserType } = useContext(AuthContext);
  setUserType(props.userType);
  return <div className="info text">{!userType ? general : userType === "student" ? student : instructor}</div>;
}

export default Welcome;
