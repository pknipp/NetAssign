import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
// import { DateTime } from 'luxon';
import AuthContext from '../auth'


const EditDeployment = ({ match }) => {
    const [deploymentId, assignmentId] = match.params.didAndAid.split(" ").map(char => Number(char));
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);
    const [courseName, setCourseName] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [deadline, setDeadline] = useState('');
    // const [deadDate, setDeadDate] = useState('');
    // const [deadTime, setDeadTime] = useState('');
    const [courseId, setCourseId] = useState(null);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const history = useHistory();
    // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/deployments/${deploymentId}`)
                if (res.ok) {
                    const data = await res.json();
                    setCourseName(data.course_name);
                    setAssignmentName(data.assignment_name);
                    setDeadline(data.deadline);
                    // setDeadline(DateTime.fromISO(data.deadline))
                    setCourseId(data.course_id);
                    // setDeadDate(data.deadline.split('T')[0])
                    // setDeadTime(dateArray[4]);
                    // setDeadTime(data.deadline.split('T')[1])
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [])

    const duplicateDeployment = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/deployments/${deploymentId}`, {
                method: 'POST',
            });
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                if (responseData.messages) setMessages(responseData.messages)
                history.push("/deployments")
            }
        })();
    }

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

    const postDeployment = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/deployments`, {
                method: 'POST', headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ assignmentId, courseId, deadline })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push(`/deployments/${courseId}`)
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
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    Assignment: {assignmentName}
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
                <button type="submit">Change deadline</button>
            </form>

            {deploymentId ? <form onSubmit={deleteDeployment}>
                {messages.map(err => <li key={err}>{err}</li>)}
                <h3>Would you like to undeploy this assignment?</h3>
                <button type="submit">Undeploy</button>
            </form> : null}
        </>
    );
};

export default EditDeployment;
