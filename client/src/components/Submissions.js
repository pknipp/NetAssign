import React, { useEffect, useContext, useState } from 'react'
import AuthContext from '../auth'

const Submissions = ({ match }) => {
    let deployment_id = match.params.deployment_id
    const [questions, setQuestions] = useState([])
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        (async () => {
            console.log("top of useEffect's async function, before try")
            try {
                console.log("top of try, before fetch")
                const res = await fetch(`/api/submissions/${deployment_id+ " " + currentUser.id}`)
                console.log("top of try, after fetch")
                if (res.ok) {
                    console.log("top of res.ok if-block")
                    const data = await res.json();
                    console.log("data = ", data);
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
                    <li key={question.id}>{question.question_id}</li>
                ))
            }
        </ul>
        </>
    )
}


export default Submissions;
