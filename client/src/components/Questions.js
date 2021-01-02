import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../auth'

const Questions = _ => {
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const { currentUser } = useContext(AuthContext)
    const [show, setShow] = useState(false)
    const [suggestions, setSuggestions] = useState([]);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [followStatus, setFollowStatus] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/questions`)
                if (res.ok) {
                    const data = await res.json();
                    setQuestion(data.specific_question);
                    setAnswer(data.specific_answer)
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [])

    return (!question) ? null :
        <div>
            {question} {answer}
        </div>
}


export default Questions
