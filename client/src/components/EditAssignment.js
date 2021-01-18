import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'


const EditAssignment = ({ match }) => {
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);
    const [assignmentId, setAssignmentId] = useState(Number(match.params.assignmentId));
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [canEdit, setCanEdit] = useState(false);
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
                    setCanEdit(data.assignment.instructor_id === currentUser.id);
                }
            } catch (err) {
                console.error(err)
            }
        })()}
    }, [rerender, assignmentId, currentUser.id])

    const putAssignment = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/assignments/${assignmentId}`, {
                method: 'PUT', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ name, isPublic })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages);
            history.push(`/assignments`)
        })();
    }

    const postAssignment = () => {
        (async _ => {
            const response = await fetchWithCSRF("/api/assignments", {
                method: 'POST', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ name, isPublic })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setAssignmentId(responseData.assignment.id)
            history.push(`/assignments/edit/${responseData.assignment.id}`)
        })();
    }

    const duplicateAssignment = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/assignments/${assignmentId}`, {
                method: 'POST', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/assignments")
        })();
    }

    const deleteAssignment = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/assignments/${assignmentId}`, {
                method: 'DELETE', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/assignments")
        })();
    }

    const getQuestions = async () => {
        if (!showMoreQuestions) {
            try {
                const res = await fetch(`/api/questions`)
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

    const postAppearance = qid => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/appearances/${assignmentId + " " + qid}`, {
                method: 'POST', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
        })();
    }

    const deleteAppearance = qid => {
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
            {errors.length ? errors.map(err => <li key={err}>{err}</li>) : ''}
            <input
                type="text" placeholder="Name" value={name} name="name"
                onChange={e => setName(e.target.value)} disabled={!canEdit && assignmentId}
            />

            {(!canEdit && assignmentId) ? null : (
                <span>
                    {isPublic ? "public " : "private "}
                    <button onClick={() => setIsPublic(!isPublic)}>toggle</button>
                    <br/>
                    <button onClick={assignmentId ? putAssignment : postAssignment}>
                        {assignmentId ? "Submit changes" : "Create Assignment"}
                    </button>
                </span>
            )}

            <ol>
                {questions.map(question => (
                    <li key={question.id}>
                        question: {question.question}<br/>
                        answer: {question.answer}<br/>
                        <button onClick={() => deleteAppearance(question.id)}>
                            drop
                        </button>
                    </li>
                ))}
            </ol>

            {!assignmentId ? null :
                <>
                    <button onClick={() => getQuestions()}>
                        {showMoreQuestions ? "Hide" : "Show"} questions which may get added to this assignment.
                    </button>
                    <ul>
                        {moreQuestions.filter(question => !questionIds.includes(question.id)).map(question => (
                            <li key={question.id}>
                                <>
                                    <button onClick={() => postAppearance(question.id)}>
                                        add
                                    </button>
                                    {question.question}
                                </>
                            </li>
                        ))}
                    </ul>

                    {messages.map(err => <li key={err}>{err}</li>)}
                    <h4>Would you like to duplicate
                        {canEdit ? " or delete ": " "} this assignment?
                    </h4>
                    <span>
                        <button onClick={() => duplicateAssignment()}>Duplicate it</button>
                        {messages.map(err => <li key={err}>{err}</li>)}
                        {!canEdit ? null :
                            <button onClick={() => deleteAssignment()}>Delete it</button>
                        }
                    </span>
                </>
            }
        </>
    );
};

export default EditAssignment;
