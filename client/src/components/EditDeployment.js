import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'


const EditDeployment = ({ match }) => {
    const deploymentId = Number(match.params.deploymentId);
    debugger;
    const { fetchWithCSRF } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [deadline, setDeadline] = useState(null);
    const [rerender, setRerender] = useState(false);
    const [courses, setCourses] = useState([]);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const history = useHistory();

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/deployments/${deploymentId}`)
                if (res.ok) {
                    const data = await res.json();
                    setName(data.name);
                    setDeadline(data.deadline);
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
                method: 'PUT', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ deadline })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            // history.push(`/assignments/${assignmentId}`)
        })();
    }

    const postDeployment = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF("/api/deployments/", {
                method: 'POST', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ courses })
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
                method: 'DELETE', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/deployments/")
        })();
    }

    return (
        <>
            <form onSubmit={deploymentId ? putDeployment : postDeployment}>
                {errors.length ? errors.map(err => <li key={err}>{err}</li>) : ''}
                Course: {name}
                <input
                    type="text" placeholder="deadline" value={deadline}
                    onChange={e => setDeadline(e.target.value)} name="deadline" />
                <button type="submit">submit change</button>
            </form>

            {deploymentId ? <form onSubmit={deleteDeployment}>
                {messages.map(err => <li key={err}>{err}</li>)}
                <h4>Would you like to unschedule this assignment?</h4>
                <button type="submit">Unschedule</button>
            </form> : null}
        </>
    );
};

export default EditDeployment;
