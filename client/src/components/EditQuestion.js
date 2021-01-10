import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'


const EditQuestion = ({ match }) => {
    const questionId = match.params.questionId;
    const { fetchWithCSRF, currentUser, setCurrentUser } = useContext(AuthContext);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [inputs, setInputs] = useState('');
    const [isPrivate, setIsPublic] = useState(true);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/questions/${questionId}`)
                if (res.ok) {
                    const data = await res.json();
                    setQuestion(data.question_answer_inputs.question);
                    setAnswer(data.question_answer_inputs.answer);
                    setInputs(data.question_answer_inputs.inputs);
                    setIsPublic(data.question_answer_inputs.is_private);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [])


    const putQuestion = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/questions/${questionId}`, {
                method: 'PUT', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ question, answer, inputs })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
        })();
    }
    const deleteQuestion = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/questions/${questionId}`, {
                method: 'DELETE', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else if (responseData.messages) {
                setMessages(responseData.messages)
            } else {
                setCurrentUser(null);
            }
        })();
    }

    return (
        <>
            <form onSubmit={putQuestion}>
                {errors.length ? errors.map(err => <li key={err}>{err}</li>) : ''}
                <input
                    type="text" value={question}
                    onChange={e => setQuestion(e.target.value)} name="question" />
                <input
                    type="text" placeholder="Answer" value={answer}
                    onChange={e => setAnswer(e.target.value)} name="answer" />
                <input
                    type="text" placeholder="Inputs" value={inputs}
                    onChange={e => setInputs(e.target.value)} name="inputs" />
                <button type="submit">Submit Changes</button>
            </form>
        </>
    );
};

export default EditQuestion;
