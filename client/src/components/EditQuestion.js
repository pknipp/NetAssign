import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'


const EditUser = _ => {
    const { fetchWithCSRF, currentUser, setCurrentUser } = useContext(AuthContext);
    const [question, setQuestion] = useState(currentUser.email);
    const [answer, setAnswer] = useState('');
    const [inputs, setInputs] = useState('')

    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    let history = useHistory();

    const submitForm = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/users/${currentUser.id}`, {
                method: 'PUT', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ email, password, password2 })
            });
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else if (responseData.messages) {
                setMessages(responseData.messages)
            } else {
                history.push('/')
            }
        })();
    }
    const deleteUser = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/users/${currentUser.id}`, {
                method: 'DELETE', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else if (responseData.messages) {
                setMessages(responseData.messages)
            } else {
                setCurrentUser(null);
            }
        })();
    }

    return (
        <>
            <form onSubmit={submitForm}>
                {errors.length ? errors.map(err => <li key={err}>{err}</li>) : ''}
                <input
                    type="email" placeholder="Question" value={email}
                    onChange={e => setEmail(e.target.value)} name="email" />
                <input
                    type="password" placeholder="Answer" value={password}
                    onChange={e => setPassword(e.target.value)} name="password" />
                <input
                    type="password" placeholder="Inputs" value={password2}
                    onChange={e => setPassword2(e.target.value)} name="password2" />
                <button type="submit">Submit Changes</button>
            </form>
            <form onSubmit={deleteUser}>
                {messages.map(err => <li key={err}>{err}</li>)}
                <h2>Would you like to delete your account?</h2>
                <button type="submit">Delete Account</button>
            </form>
        </>
    );
};

export default EditUser;
