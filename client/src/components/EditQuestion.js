import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'


const EditQuestion = ({ match }) => {
    const questionId = Number(match.params.questionId)  ;
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);
    const [question, setQuestion] = useState('');
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
                    setQuestion(data.question_answer_inputs.question);
                    setAnswer(data.question_answer_inputs.answer);
                    setInputs(data.question_answer_inputs.inputs);
                    setIsPublic(data.question_answer_inputs.is_public);
                }
            } catch (err) {
                console.error(err)
            }
        })()}
    }, [])

    const putQuestion = e => {
        console.log("top of putQuestion");
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/questions/${questionId}`, {
                method: 'PUT', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ question, answer, inputs, isPublic })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/questions")
        })();
    }

    const postQuestion = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/questions/me/${currentUser.id}`, {
                method: 'POST', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ question, answer, inputs, isPublic })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/questions")
        })();
    }

    const duplicateQuestion = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/questions/${questionId}`, {
                method: 'POST', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/questions")
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
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/questions")
        })();
    }

    return (
        <>
            {/* <form onSubmit={questionId ? putQuestion : postQuestion}> */}
                {errors.length ? errors.map(err => <li key={err}>{err}</li>) : ''}
                <input
                    type="text" placeholder="Question" value={question}
                    onChange={e => setQuestion(e.target.value)} name="question" />
                <input
                    type="text" placeholder="Answer" value={answer}
                    onChange={e => setAnswer(e.target.value)} name="answer" />
                <input
                    type="text" placeholder="Inputs" value={inputs}
                    onChange={e => setInputs(e.target.value)} name="inputs" />
                <span>
                    <>
                    {(currentUser.id === question.instructor_id) ? null : (
                        <span>
                            {isPublic ? "public " : "private "}
                            <button onClick={() => setIsPublic(!isPublic)}>toggle</button>
                        </span>
                    )
                    }
                    </>
                </span>
                <button onClick={questionId ? putQuestion : postQuestion}>Submit changes</button>
            {/* </form> */}
            {!questionId ? null :
                <>
                    <form onSubmit={duplicateQuestion} >
                        {messages.map(err => <li key={err}>{err}</li>)}
                        <h4>Would you like to duplicate this question?</h4>
                        <button type="submit">Duplicate Question</button>
                    </form>
                    <form onSubmit={deleteQuestion}>
                        {messages.map(err => <li key={err}>{err}</li>)}
                        <h4>Would you like to delete this question?</h4>
                        <button type="submit">Delete Question</button>
                    </form>
                </>
            }
        </>
    );
};

export default EditQuestion;
