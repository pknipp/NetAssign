import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'


const EditUser = props => {
    const { fetchWithCSRF, currentUser, setCurrentUserId } = useContext(AuthContext);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('')

    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    let history = useHistory();

    const submitForm = e => {
        e.preventDefault();

        // Make the following an IIFE?
        async function editUser() {
            const response = await fetchWithCSRF(`/api/users/${props.currentUserId}`, {
                method: 'PUT', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ email, password, password2 })
            });

            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else if (responseData.messages) {
                setMessages(responseData.messages)
            } else {
                // setCurrentUserId(responseData.current_user_id)
                history.push('/')
            }
        }
        editUser();
    }

    const deleteUser = e => {
        e.preventDefault();

        // Make the following an IIFE?
        async function deleteUser() {
            const response = await fetchWithCSRF(`/api/users/${props.currentUserId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({})
            });

            console.log(response);
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else if (responseData.messages) {
                setMessages(responseData.messages)
            }
            else {
                // setCurrentUserId(responseData.current_user_id)
                setCurrentUserId(null);
                // history.push('/')

            }
        }
        deleteUser();
    }

    return (
        <>
            <form onSubmit={submitForm}>
                {errors.length ? errors.map(err => <li key={err}>{err}</li>) : ''}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)} name="email" />
                <input
                    type="password"
                    placeholder="New password (required)"
                    value={password}
                    onChange={e => setPassword(e.target.value)} name="password" />
                <input
                    type="password"
                    placeholder="Confirm new password (required)"
                    value={password2}
                    onChange={e => setPassword2(e.target.value)} name="password2" />
                <button type="submit">Submit Changes</button>
            </form>
            <form onSubmit={deleteUser}>
                {messages.length ? messages.map(err => <li key={err}>{err}</li>) : ''}
                <h2>Would you like to delete your account?</h2>
                <button type="submit">Delete Account</button>
            </form>
        </>
    );
};

export default EditUser;
