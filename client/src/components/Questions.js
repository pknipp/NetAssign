import React, { useState, useContext, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'
import Question from './Question';


const Questions = () => {
    const { fetchWithCSRF } = useContext(AuthContext);
    const [, setErrors] = useState([]);
    const [, setMessages] = useState([]);
    const [questions, setQuestions] = useState([]);
    // let history = useHistory();

    useEffect(() => {
        (async () => {
            const response = await fetchWithCSRF("/api/questions/");
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else if (responseData.messages) {
                setMessages(responseData.messages);
            } else {
                setQuestions(responseData.questions);
            }
        })();
    }, [])

    return (
        questions.map(question => {
            let { id, author, answer, inputs } = question
            return (
                <ul>
                    <Question key={id} author={author} question={question.question} answer={answer} inputs={inputs} />
                </ul>
            )
        })
    )
};

export default Questions;
