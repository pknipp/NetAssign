import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../auth'

const Questions = _ => {
    const [question, setQuestion] = useState("")
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
                    setQuestion(data.question);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [])

    return (!question) ? null :
        <div>
            {question}
        </div>
}


export default Questions
