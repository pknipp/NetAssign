import React, { useEffect, useContext, useState } from 'react';
import Submission from './Submission';
import AuthContext from '../auth';

const Submissions = ({ match }) => {
    let deploymentId = match.params.deploymentId;
    const [questionsAndResponses, setQuestionsAndResponses] = useState([]);
    const [assignmentName, setAssignmentName] = useState("");
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/submissions/${deploymentId}`)
                if (res.ok) {
                    const data = await res.json();
                    setQuestionsAndResponses(data.questions_and_responses);
                    setAssignmentName(data.assignment_name);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [deploymentId, currentUser.id])

    return (
        <>
        <h3>Questions for "{assignmentName}" assignment:</h3>
        <ol>
            {(!questionsAndResponses.length) ? null :
                questionsAndResponses.map((questionAndResponse, index) => (
                    <Submission key={questionAndResponse.id} qAndR={questionAndResponse} number={index} deploymentId={deploymentId}/>
                    // <h3>Hello world</h3>
                ))
            }
        </ol>
        </>
    )
}


export default Submissions;
