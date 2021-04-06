import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import AuthContext from '../auth';
import ToggleInfo from './ToggleInfo';

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
    const [showInfo, setShowInfo] = useState({});
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const history = useHistory();

    const text = {
        privacy: "This controls whether or not other instructors will be able to see, use, and/or duplicate this assignment.  (Regardless they'll not have edit/delete privileges.)",
    };

    const getAssignment = () => {
        if (assignmentId > 0) {
            (async () => {
                try {
                    const response = await fetch(`/api/assignments/${assignmentId}`)
                    const data = await response.json();
                    if (!response.ok) {
                        setErrors(data.errors);
                    } else {
                        setName(data.assignment.name);
                        setIsPublic(data.assignment.is_public);
                        setQuestions(data.questions);
                        setQuestionIds(data.questions.map(question => question.id));
                        setCanEdit(data.assignment.instructor_id === currentUser.id);
                    }
                } catch (err) {
                    console.error(err)
                }
            })()
        }
    };

    useEffect(getAssignment, [rerender]);

    const handleToggle = e => {
        let name = e.currentTarget.name;
        let newShowInfo = {...showInfo};
        newShowInfo[name] = !showInfo[name];
        setShowInfo(newShowInfo);
    }

    const putAssignment = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/assignments/${assignmentId}`, {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify({ name, isPublic })
            });
            const data = await response.json();
            // if (!response.ok) setErrors(data.errors);
            setErrors(data.errors || []);
            // if (data.messages) setMessages(data.messages);
            setMessages(data.messages || []);
            history.push(`/assignments`)
        })();
    }

    const postAssignment = () => {
        (async _ => {
            const response = await fetchWithCSRF("/api/assignments", {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify({ name, isPublic })
            });
            const data = await response.json();
            if (!response.ok) {
                setErrors(data.errors);
            } else {
                // if (data.messages) setMessages(data.messages)
                setMessages(data.messages || "")
                setAssignmentId(data.assignment.id)
                history.push(`/assignments/${data.assignment.id}`)
            }
        })();
    }

    const duplicateAssignment = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/assignments/${assignmentId}`, {
                method: 'POST',
            });
            const data = await response.json();
            // if (!response.ok) {
            setErrors(data.errors || []);
            // } else {
                // if (responseData.messages) setMessages(responseData.messages)
            setMessages(data.messages || []);
            if (response.ok) history.push("/assignments")
            // }
        })();
    }

    const deleteAssignment = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/assignments/${assignmentId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            // if (!response.ok) setErrors(data.errors);
            setErrors(data.errors || []);
            // if (responseData.messages) setMessages(responseData.messages)
            setMessages(data.messages || []);
            history.push("/assignments")
        })();
    }

    const getQuestions = async () => {
        if (!showMoreQuestions) {
            try {
                const response = await fetch(`/api/questions`)
                if (response.ok) {
                    const data = await response.json();
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
                method: 'POST',
            });
            const data = await response.json();
            // if (!response.ok) setErrors(data.errors);
            setErrors(data.errors || []);
            // if (data.messages) setMessages(responseData.messages)
            setMessages(data.messages || []);
            setRerender(!rerender);
        })();
    }

    const deleteAppearance = qid => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/appearances/${assignmentId + " " + qid}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            // if (!response.ok) setErrors(data.errors);
            setMessages(data.messages || [])
            // if (responseData.messages) setMessages(responseData.messages)
            setMessages(data.messages || []);
            setRerender(!rerender);
        })();
    }

    return !currentUser.is_instructor ? <Redirect to="/login" /> : (
        <>
            <h2>Assignment Editor</h2>
            {errors.length ? errors.map(err => (
                <li key={err} className="error">
                    {err}
                </li>
            ))
                : ''
            }
            <h4>
                Assignment name:
            </h4>
            <input
                type="text"
                placeholder="Name of new assignment"
                value={name}
                className="larger"
                onChange={e => setName(e.target.value)}
                disabled={!canEdit && assignmentId}
            />

            {(!canEdit && assignmentId) ? null : (
                <>
                    <h4>
                        privacy setting:
                        <ToggleInfo
                            onClick={handleToggle}
                            name="privacy"
                            toggle={showInfo.privacy}
                        />
                    </h4>
                    <div>
                        <i>
                            {showInfo.privacy ? text.privacy : null}
                        </i>
                    </div>
                    {isPublic ? "public " : "private "}
                    <button onClick={() => setIsPublic(!isPublic)}>
                        toggle
                    </button>
                    <span>
                        <button onClick={assignmentId ? putAssignment : postAssignment}>
                            <h3>{assignmentId ? "Submit changes" : "Create assignment"}</h3>
                        </button>
                        <button onClick={() => history.push("/assignments")}><h3>Cancel</h3></button>
                    </span>
                </>
            )}
            {!assignmentId ? null
                : "Refresh browser in order to see different versions of questions."
            }

            <ol>
                {questions.map(question => (
                    <li key={question.id}>
                        question: {question.question}<br/>
                        answer: {question.answer}<br/>
                        {!canEdit && assignmentId ? null :
                           <button onClick={() => deleteAppearance(question.id)}>
                            drop
                        </button>}
                    </li>
                ))}
            </ol>

            {!assignmentId ? null :
                <>
                    {!canEdit && assignmentId ? null :
                    <button onClick={() => getQuestions()}>
                        {showMoreQuestions ? "Hide" : "Show"}
                            questions which may get added to this assignment.
                    </button>}
                    <ul>
                        {moreQuestions.filter(question =>
                            !questionIds.includes(question.id)
                                .map(question => (
                                    <li key={question.id}>
                                        <>
                                            <button
                                                onClick={() => postAppearance(question.id)}
                                            >
                                                add
                                            </button>
                                            {question.question}
                                        </>
                                    </li>
                                ))
                        )}
                    </ul>

                    {messages.map(err => <li key={err}>{err}</li>)}
                    <h4>Would you like to duplicate
                        {canEdit ? " or delete ": " "} this assignment?
                    </h4>
                    <span>
                        <button onClick={() => duplicateAssignment()}>
                            <h3>Duplicate</h3>
                        </button>

                        {messages.map(err => <li key={err}>{err}</li>)}
                        {!canEdit ? null :
                            <button onClick={() => deleteAssignment()}>
                                <h3>
                                    Delete
                                </h3>
                            </button>
                        }
                        <button onClick={() => history.push("/assignments")}>
                            <h3>
                                Cancel
                            </h3>
                        </button>
                    </span>
                </>
            }
        </>
    );
};

export default EditAssignment;
