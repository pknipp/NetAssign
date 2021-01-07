import React, { useEffect, useContext, useState } from 'react';
import Question from './Question';
import AuthContext from '../auth';

const Submissions = ({ match }) => {
    let deployment_id = match.params.deployment_id;
    const [questionsAndResponses, setQuestionsAndResponses] = useState([]);
    const [assignmentName, setAssignmentName] = useState("");
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/submissions/${deployment_id+ " " + currentUser.id}`)
                if (res.ok) {
                    const data = await res.json();
                    setQuestionsAndResponses(data.questions_and_responses);
                    setAssignmentName(data.assignment_name);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [deployment_id, currentUser.id])

    return (
        <>
        <h3>Questions for "{assignmentName}" assignment:x<sup>2</sup></h3>
        <ol>
            {(!questionsAndResponses.length) ? null :
                questionsAndResponses.map((questionAndResponse, index) => (
                    <Question qAndR={questionAndResponse} number={index} deployment_id={deployment_id}/>
                ))
            }
        </ol>
        </>
    )
}


export default Submissions;
