import React, { useEffect, useContext, useState } from 'react';
import EditSubmission from './EditSubmission';
import AuthContext from '../auth';

const Submissions = ({ match }) => {
    let deploymentId = match.params.deploymentId;
    const [questionsAndResponses, setQuestionsAndResponses] = useState([]);
    const [assignmentName, setAssignmentName] = useState("");
    const { currentUser } = useContext(AuthContext);

    const getSubmissions = async () => {
        try {
            const response = await fetch(`/api/submissions/${deploymentId}`)
            if (response.ok) {
                const data = await response.json();
                setQuestionsAndResponses(data.questions_and_responses);
                setAssignmentName(data.assignment_name);
            }
        } catch (err) {
            console.error(err)
        }
    };

    useEffect(() => {
        getSubmissions();
    }, [deploymentId, currentUser.id]);

    return (
        <>
        <h3>Questions for "{assignmentName}" assignment:</h3>
        <ol>
            {(!questionsAndResponses.length) ? null :
                questionsAndResponses.map((questionAndResponse, index) => (
                    <EditSubmission
                        key={questionAndResponse.id}
                        qAndR={questionAndResponse}
                        number={index}
                        deploymentId={deploymentId}
                    />
                ))
            }
        </ol>
        </>
    )
}

export default Submissions;
