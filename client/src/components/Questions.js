import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../auth'

const Questions = _ => {
    const [qAndAs, setQandAs] = useState([])
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/questions`)
                if (res.ok) {
                    const data = await res.json();
                    setQandAs(data.specific_questions);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [])

    return (!qAndAs.length) ? null :
        <ul>
            {qAndAs.map(qAndA => (
                <li>{qAndA.question}
                {qAndA.answer}</li>
            ))}
        </ul>
}


export default Questions
