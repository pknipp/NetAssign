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

    useEffect(() => {
        if (assignmentId > 0) {
        (async () => {
            try {
                const res = await fetch(`/api/assignments/${assignmentId}`)
                const data = await res.json();

                if (!res.ok) {
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
        })()}
    }, [rerender])

    const handleToggle = e => {
        let name = e.currentTarget.name;
        let newShowInfo = {...showInfo};
        newShowInfo[name] = !showInfo[name];
        setShowInfo(newShowInfo);
    }

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
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                if (responseData.messages) setMessages(responseData.messages)
                setAssignmentId(responseData.assignment.id)
                history.push(`/assignments/${responseData.assignment.id}`)
            }
        })();
    }

    const duplicateAssignment = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/assignments/${assignmentId}`, {
                method: 'POST',
            });
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                if (responseData.messages) setMessages(responseData.messages)
                history.push("/assignments")
            }
        })();
    }

    const deleteAssignment = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/assignments/${assignmentId}`, {
                method: 'DELETE',
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
                method: 'POST',
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
                method: 'DELETE',
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
        })();
    }

    return !currentUser.is_instructor ? <Redirect to="/login" /> : (
        <>
            <h2>Assignment Editor</h2>
            {errors.length ? errors.map(err => <li key={err} className="error">{err}</li>) : ''}
            <input
                type="text" placeholder="Name of new assignment" value={name} className="larger"
                onChange={e => setName(e.target.value)} disabled={!canEdit && assignmentId}
            />

            {(!canEdit && assignmentId) ? null : (
                <>
                    <h4>
                        privacy setting:
                        <ToggleInfo onClick={handleToggle} name="privacy" toggle={showInfo.privacy} />
                    </h4>
                    <div><i>{showInfo.privacy ? text.privacy : null}</i></div>
                    {isPublic ? "public " : "private "}
                    <button onClick={() => setIsPublic(!isPublic)}>toggle</button>
                    <button onClick={assignmentId ? putAssignment : postAssignment}>
                        <h3>{assignmentId ? "Submit changes" : "Create question"}</h3>
                    </button>
                </>
            )}
            {!assignmentId ? null : "Refresh browser in order to see different versions of questions."}

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
                        {showMoreQuestions ? "Hide" : "Show"} questions which may get added to this assignment.
                    </button>}
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
                        <button onClick={() => duplicateAssignment()}><h3>duplicate</h3></button>
                        {messages.map(err => <li key={err}>{err}</li>)}
                        {!canEdit ? null :
                            <button onClick={() => deleteAssignment()}><h3>delete</h3></button>
                        }
                    </span>
                </>
            }
        </>
    );
};

export default EditAssignment;
