import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import AuthContext from '../auth'

const LogIn = props => {
    const [usernameoremail, setUsernameoremail] = useState("dug@aol.com");
    const [password, setPassword] = useState("password");
    const [errors, setErrors] = useState([]);
    const { fetchWithCSRF, setCurrentUserId, setCurrentUser } = useContext(AuthContext);
    let history = useHistory();

    const submitForm = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/session/`, {
                method: 'PUT', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({usernameoremail, password})
            });
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                setCurrentUserId(responseData.current_user_id);
                setCurrentUser(responseData.current_user);
                history.push('/')
            }
        })();
    }
    return (
        <form onSubmit={submitForm}>
            {errors.length ? errors.map((err) => <li key={err} color="red">{err}</li>) :''}
            Username or email
            <input
                type="text"
                placeholder="Username or email"
                value={usernameoremail}
                onChange={(e) => setUsernameoremail(e.target.value)}
                name="usernameoremail" />
            Password
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default LogIn;
