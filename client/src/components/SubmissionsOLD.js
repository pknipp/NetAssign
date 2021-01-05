import React, { useEffect, useContext, useState } from 'react'
import AuthContext from '../auth'

const Submissions = ({ match }) => {
    let deployment_id = match.params.deployment_id
    const [questions, setQuestions] = useState([])
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/submissions/${deployment_id+ " " + currentUser.id}`)
                if (res.ok) {
                    const data = await res.json();
                    setQuestions(data.questions);
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
            {(!questions.length) ? null :
                questions.map(question => (
                    <li key={question.id}>{question.question} ({question.answer})</li>
                ))
            }
        </ul>
        </>
    )
}


export default Submissions;
