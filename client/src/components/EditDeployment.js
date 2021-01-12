import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'


const EditDeployment = ({ match }) => {
    const deploymentId = Number(match.params.deploymentId)  ;
    const { fetchWithCSRF } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [rerender, setRerender] = useState(false);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const history = useHistory();

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/deployments/${deploymentId}`)
                if (res.ok) {
                    const data = await res.json();
                    setName(data.assignment.name);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [rerender])

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
            history.push(`/assignments/${assignmentId}`)
        })();
    }

    const postDeployment = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF("/api/deployments/", {
                method: 'POST', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ name, isPublic })
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


            {assignmentId ? <form onSubmit={deleteAssignment}>
                {messages.map(err => <li key={err}>{err}</li>)}
                <h4>Would you like to delete this assignment?</h4>
                <button type="submit">Delete Assignment</button>
            </form> : null}
        </>
    );
};

export default EditDeployment;
