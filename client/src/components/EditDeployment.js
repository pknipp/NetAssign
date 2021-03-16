import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import {LocalDateTime} from '@js-joda/core';
// import { DateTime } from 'luxon';
import AuthContext from '../auth';


const EditDeployment = ({ match }) => {
    const didAndAidAndCid = match.params.didAndAidAndCid;
    const didAndAidAndCidArray = didAndAidAndCid.split(" ").map(char => Number(char));
    const [deploymentId, assignmentId] = didAndAidAndCidArray;
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);
    const [courseName, setCourseName] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [deadline, setDeadline] = useState('');
    const [courseId, setCourseId] = useState(didAndAidAndCidArray[2]);
    const [now, setNow] = useState(LocalDateTime.now());
    const [questions, setQuestions] = useState([]);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const history = useHistory();

    const getDeployment = () => {
        (async () => {
            try {
                const res = await fetch(`/api/deployments/${didAndAidAndCid}`);
                if (res.ok) {
                    const data = await res.json();
                    setCourseName(data.course_name);
                    setAssignmentName(data.assignment_name);
                    setQuestions(data.questions);
                    setDeadline(data.deadline);
                    setCourseId(data.course_id);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    };

    useEffect(getDeployment, [deploymentId]);

    const putDeployment = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/deployments/${deploymentId}`, {
                method: 'PUT', headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ deadline })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push(`/courses/${courseId}`)
        })();
    }

    const duplicateDeployment = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/deployments/${deploymentId}`, {
                method: 'POST',
            });
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else if (responseData.messages) {
                setMessages(responseData.messages);
            } else {
                setNow(LocalDateTime.now());
                history.push(`/courses/${courseId}`);
            }
        })();
    }

    const postDeployment = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/deployments/0 ${assignmentId} ${courseId}`, {
                method: 'POST'}
            );
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push(`/courses/${courseId}`)
        })();
    }

    const deleteDeployment = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/deployments/${deploymentId}`, {
                method: 'DELETE',
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push(`/courses/${courseId}`)
        })();
    }

    return !currentUser.is_instructor ? <Redirect to="/login" /> : (
        <>
            <h2>Deployment Editor</h2>
            <form onSubmit={deploymentId ? putDeployment : postDeployment}>
                {errors.length ? errors.map(err => <li key={err}>{err}</li>) : ''}
                <span>
                    Course: {courseName}
                </span>
                <span>
                    deadline:
                    <input type="date" value={deadline.split('T')[0]} onChange={e => {
                        setDeadline(e.target.value + 'T' + deadline.split('T')[1]);
                    }} />
                    <input type="time" value={deadline.split('T')[1]} onChange={e => {
                        setDeadline(deadline.split('T')[0] + 'T' + e.target.value);
                    }} />
                </span>
                {`Deadline is in the ${now > deadline ? "past." : "future."}`}
                <span>
                    <button type="submit"><h3>Change deadline</h3></button>
                    <button onClick={() => history.push(`/courses/${courseId}`)}><h3>Cancel</h3></button>
                </span>
            </form>
            <div>
                {messages.map(err => <li key={err}>{err}</li>)}
                {deploymentId ?
                    <h3>
                        Would you like to undeploy this assignment or to duplicate this deployment?
                    </h3>
                :
                    <>
                    <h3>Questions for "{assignmentName}" assignment:</h3>
                    <ol>
                        {questions.map(question => (
                            <li>
                                {question.question}
                            </li>
                        ))}
                    </ol>
                    </>
                }
                <p align="center">
                    {deploymentId ?
                        <>
                            <button onClick={deleteDeployment}><h3>Undeploy</h3></button>
                            <button onClick={duplicateDeployment}><h3>Duplicate</h3></button>
                        </>
                    :
                        <button onClick={postDeployment}><h3>Deploy</h3></button>
                    }
                    <button onClick={() => history.push(`/courses/${courseId}`)}>
                        <h3>Cancel</h3>
                    </button>
                </p>
            </div>
        </>
    );
};

export default EditDeployment;
