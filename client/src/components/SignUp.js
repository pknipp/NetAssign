import React, { useState, useContext } from 'react';
import AuthContext from '../auth';

const SignUp = props => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [canfollow, setCanfollow] = useState(false);
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('')
    const { fetchWithCSRF, setCurrentUserId, setCurrentUser } = useContext(AuthContext);
    const [errors, setErrors] = useState([]);
    const [fullname, setFullname] = useState('');

    const submitForm = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/users/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    canfollow,
                    email,
                    username,
                    fullname,
                    password,
                    password2
                })
            });

            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                setCurrentUserId(responseData.current_user_id)
                setCurrentUser(responseData.current_user);
            }
        })();
    }

    return (
        <form onSubmit={submitForm}>
            {errors.length ? errors.map(err => <li key={err} >{err}</li>) : ''}
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)} name="email" />
            <input
                type="text"
                placeholder="Name"
                value={fullname}
                onChange={e => setFullname(e.target.value)} name="fullname" />
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)} name="username" />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)} name="password" />
            <input
                type="password"
                placeholder="Confirm password"
                value={password2}
                onChange={e => setPassword2(e.target.value)} name="password2" />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignUp;
