import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import AuthContext from '../auth'


const EditDeployment = ({ match }) => {
    const deploymentId = Number(match.params.deploymentId);
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);
    const [courseName, setCourseName] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [deadline, setDeadline] = useState(null);
    const [deadstring, setDeadstring] = useState('');
    const [courseId, setCourseId] = useState(null);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const history = useHistory();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/deployments/${deploymentId}`)
                if (res.ok) {
                    const data = await res.json();
                    setCourseName(data.course_name);
                    setAssignmentName(data.assignment_name);
                    setDeadline(data.deadline);
                    setCourseId(data.course_id);
                    let dateArray = data.deadline.split(' ');
                    let yyyy = dateArray[3];
                    let dd = Number(dateArray[1]);
                    dd = (dd < 10 ? '0' : '') + String(dd);
                    let mm = months.indexOf(dateArray[2]) + 1;
                    mm = (mm < 10 ? '0' : '') + String(mm);
                    setDeadstring(yyyy + '-' + mm + '-' + dd);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [])

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
        })();
    }

    const postDeployment = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF("/api/deployments", {
                method: 'POST', headers: {"Content-Type": "application/json"},
                // credentials: 'include',
                body: JSON.stringify({ courseId })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/assignments")
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
            <form onSubmit={deploymentId ? putDeployment : postDeployment}>
                {errors.length ? errors.map(err => <li key={err}>{err}</li>) : ''}
                Course: {courseName}<br/>
                Assignment: {assignmentName}
                <br/>{!deadline ? null : deadline.split(' ').join('#')}
                <br/>{deadstring}
                <input type="date" value={deadstring} onChange={e => setDeadstring(e.target.value)} />
                <input
                    type="text" placeholder="deadline" value={deadline}
                    onChange={e => setDeadline(e.target.value)} className="larger" />
                <button type="submit">submit change</button>
            </form>

            {deploymentId ? <form onSubmit={deleteDeployment}>
                {messages.map(err => <li key={err}>{err}</li>)}
                <h3>Would you like to unschedule this assignment?</h3>
                <button type="submit">Unschedule</button>
            </form> : null}
        </>
    );
};

export default EditDeployment;
