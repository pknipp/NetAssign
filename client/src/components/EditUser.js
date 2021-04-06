import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'


const EditUser = _ => {
    const { fetchWithCSRF, currentUser, setCurrentUser } = useContext(AuthContext);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('')

    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    let history = useHistory();

    const putUser = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/users`, {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ email, password, password2 })
            });
            const data = await response.json();
            if (!response.ok) return setErrors(data.errors);
            if (data.messages) return setMessages(data.messages)
            setCurrentUser(data.current_user)
            history.push('/')
        })();
    }

    const deleteUser = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/users`, {method: 'DELETE'});
            const data = await response.json();
            setErrors(data.errors || []);
            setMessages(data.messages || [])
            setCurrentUser(null);
        })();
    }

    return (
        <>
            <h3>My account information:</h3>
            <form onSubmit={putUser}>
                {errors.map(err => <li key={err} className="error">{err}</li>)}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="larger"
                />
                <input
                    type="password"
                    placeholder="New password (required)"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="larger"
                />
                <input
                    type="password"
                    placeholder="Confirm new password (required)"
                    value={password2}
                    onChange={e => setPassword2(e.target.value)}
                    className="larger"
                />
                <button type="submit">
                    Submit changes
                </button>
            </form>
            <form onSubmit={deleteUser}>
                {messages.map(err => <li key={err}>{err}</li>)}
                <h4>Would you like to delete your account?</h4>
                <button type="submit">Delete Account</button>
            </form>
        </>
    );
};

export default EditUser;
