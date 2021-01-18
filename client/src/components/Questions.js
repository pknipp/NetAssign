import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth'
import Question from './Question';


const Questions = () => {
    const { fetchWithCSRF } = useContext(AuthContext);
    const [, setErrors] = useState([]);
    const [, setMessages] = useState([]);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await fetchWithCSRF(`/api/questions`);
            const responseData = await response.json();
            if (!response.ok) return setErrors(responseData.errors);
            if (responseData.messages) return setMessages(responseData.messages);
            setQuestions(responseData.questions);
        })();
    }, [])

    return (
        <>
        <NavLink exact to={"/questions/0"} className="nav" activeClassName="active">
            create new question
        </NavLink>
        {questions.map(question => {
            return (
                <ul>
                    <Question
                        key={question.id} question={question} />
                </ul>
            )
        })}
        </>
    )
};

export default Questions;
