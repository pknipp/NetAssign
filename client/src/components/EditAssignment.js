import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'


const EditAssignment = ({ match }) => {
    const assignmentId = Number(match.params.assignmentId)  ;
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);
    // const [assignment, setAssignment] = useState('');
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [questionIds, setQuestionIds] = useState([]);
    const [moreQuestions, setMoreQuestions] = useState([]);
    const [showMoreQuestions, setShowMoreQuestions] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (assignmentId > 0) {
        (async () => {
            try {
                const res = await fetch(`/api/assignments/${assignmentId}`)
                if (res.ok) {
                    const data = await res.json();
                    setName(data.assignment.name);
                    setIsPublic(data.assignment.is_public);
                    setQuestions(data.questions);
                    setQuestionIds(data.questions.map(question => question.id));
                }
            } catch (err) {
                console.error(err)
            }
        })()}
    }, [rerender])

    const putAssignment = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/assignments/${assignmentId}`, {
                method: 'PUT', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ name, isPublic })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push(`/assignments/${assignmentId}`)
        })();
    }

    const postAssignment = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF("/api/assignments", {
                method: 'POST', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ name, isPublic })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/assignments")
        })();
    }

    const deleteAssignment = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/assignments/${assignmentId}`, {
                method: 'DELETE', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/assignments/")
        })();
    }

    const getMoreQuestions = async () => {
        if (!showMoreQuestions) {
            try {
                const res = await fetch(`/api/questions/${currentUser.id}`)
                if (res.ok) {
                    const data = await res.json();
                    setMoreQuestions(data.questions);;
                }
            } catch (err) {
                console.error(err)
            }
        } else {
            setMoreQuestions([]);
        }
        setShowMoreQuestions(!showMoreQuestions);
        setRerender(!rerender);
    }

    const dropQuestion = (e, qid) => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/appearances/${assignmentId + " " + qid}`, {
                method: 'DELETE', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
        })();
    }

    return (
        <>
            <form onSubmit={assignmentId ? putAssignment : postAssignment}>
                {errors.length ? errors.map(err => <li key={err}>{err}</li>) : ''}
                <input
                    type="text" placeholder="Name" value={name}
                    onChange={e => setName(e.target.value)} name="name" />
                 <span>
                    {isPublic ? "Public " : "Private "}
                    <button onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsPublic(!isPublic)
                    }}>
                        toggle
                    </button>
                </span>
                <button type="submit">Submit Changes</button>
            </form>
            <ol>
                {questions.map(question => (
                    <li key={question.id}>
                        question: {question.question}<br/>
                        answer: {question.answer}<br/>
                        <button onClick={e => dropQuestion(e, question.id)}>
                            drop
                        </button>
                    </li>
                ))}
            </ol>

            <>
                    <button onClick={() => getMoreQuestions()}>
                        {showMoreQuestions ? "Hide" : "Show"} questions that are not already on this assignment.
                    </button>
                    <ul>
                        {moreQuestions.filter(question => !questionIds.includes(question.id)).map(question => (
                            <li key={question.id}>
                                <>
                                    {/* <button onClick={e => createAppearance(e, question.id)}>
                                        add
                                    </button> */}
                                    {question.question}
                                </>
                            </li>
                        ))}
                    </ul>
                </>


            {assignmentId ? <form onSubmit={deleteAssignment}>
                {messages.map(err => <li key={err}>{err}</li>)}
                <h4>Would you like to delete this assignment?</h4>
                <button type="submit">Delete Assignment</button>
            </form> : null}
        </>
    );
};

export default EditAssignment;
