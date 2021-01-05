import React, { useEffect, useContext, useState } from 'react';
import Question from './Question';
import AuthContext from '../auth';

const Submissions = ({ match }) => {
    let deployment_id = match.params.deployment_id;
    const [questionsAndResponses, setQuestionsAndResponses] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/submissions/${deployment_id+ " " + currentUser.id}`)
                if (res.ok) {
                    const data = await res.json();
                    setQuestionsAndResponses(data.questions_and_responses);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [deployment_id, currentUser.id])

    return (
        <>
        <h3>Assignment:</h3>
        <ul>
            {(!questionsAndResponses.length) ? null :
                questionsAndResponses.map((questionAndResponse, index) => (
                    <Question questionAndResponse={questionAndResponse} number={index} deployment_id={deployment_id}/>
                ))
            }
        </ul>
        </>
    )
}


export default Submissions;
