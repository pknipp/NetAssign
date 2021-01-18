import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'


const EditQuestion = ({ match }) => {
    const questionId = Number(match.params.questionId)  ;
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);
    const [question, setQuestion] = useState('');
    const [canEdit, setCanEdit] = useState(false);
    const [answer, setAnswer] = useState('');
    const [inputs, setInputs] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (questionId > 0) {
        (async () => {
            try {
                const res = await fetch(`/api/questions/${questionId}`)
                if (res.ok) {
                    const data = await res.json();
                    // console.log("author = data.question_answer_inputs.instuctor_id")
                    setQuestion(data.question_answer_inputs.question);
                    setAnswer(data.question_answer_inputs.answer);
                    setInputs(data.question_answer_inputs.inputs);
                    setIsPublic(data.question_answer_inputs.is_public);
                    setCanEdit(data.question_answer_inputs.instructor_id === currentUser.id);
                }
            } catch (err) {
                console.error(err)
            }
        })()}
    }, [])

    const putQuestion = () => {
        // e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/questions/${questionId}`, {
                method: 'PUT', headers: {"Content-Type": "application/json"},
                // credentials: 'include',
                body: JSON.stringify({ question, answer, inputs, isPublic })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/questions")
        })();
    }

    const postQuestion = () => {
        // e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/questions`, {
                method: 'POST', headers: {"Content-Type": "application/json"},
                // credentials: 'include',
                body: JSON.stringify({ question, answer, inputs, isPublic })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/questions")
        })();
    }

    const duplicateQuestion = () => {
        // e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/questions/${questionId}`, {
                method: 'POST',
                // headers: {"Content-Type": "application/json"},
                // credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/questions")
        })();
    }

    const deleteQuestion = () => {
        // e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/questions/${questionId}`, {
                method: 'DELETE',
                // headers: {"Content-Type": "application/json"},
                // credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/questions")
        })();
    }

    return (
        <>
            {errors.length ? errors.map(err => <li key={err}>{err}</li>) : ''}
            <input
                type="text" placeholder="Question" value={question} name="question"
                onChange={e => setQuestion(e.target.value)} disabled={!canEdit && questionId}/>
            <input
                type="text" placeholder="Answer" value={answer} name="answer"
                onChange={e => setAnswer(e.target.value)} disabled={!canEdit && questionId}/>
            <input
                type="text" placeholder="Inputs" value={inputs} name="inputs"
                onChange={e => setInputs(e.target.value)} disabled={!canEdit && questionId}/>
            {(!canEdit && questionId) ? null : (
                <span>
                    {isPublic ? "public " : "private "}
                    <button onClick={() => setIsPublic(!isPublic)}>toggle</button>
                    <br/>
                    <button onClick={questionId ? putQuestion : postQuestion}>
                        {questionId ? "Submit changes" : "Create question"}
                    </button>
                </span>
            )}
            {!questionId ? null :
                <>
                    {messages.map(err => <li key={err}>{err}</li>)}
                    <h4>Would you like to duplicate
                        {canEdit ? " or delete ": " "} this question?
                    </h4>
                    <span>
                        <button onClick={() => duplicateQuestion()}>Duplicate it</button>
                        {messages.map(err => <li key={err}>{err}</li>)}
                        {!canEdit ? null :
                            <button onClick={() => deleteQuestion()}>Delete it</button>
                        }
                    </span>
                </>
            }
        </>
    );
};

export default EditQuestion;
