import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import AuthContext from '../auth'

const LogIn = props => {
    const [email, setEmail] = useState("demo@aol.com");
    const [password, setPassword] = useState("password");
    const [errors, setErrors] = useState([]);
    const { fetchWithCSRF, setCurrentUser } = useContext(AuthContext);
    let history = useHistory();

    const submitForm = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/session/`, {
                method: 'PUT', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({email, password})
            });
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                setCurrentUser(responseData.current_user);
                history.push('/')
            }
        })();
    }
    return (
        <form onSubmit={submitForm}>
            {errors.map(err => <li key={err} color="red">{err}</li>)}
            Email
            <input
                type="text" placeholder="Email" value={email}
                onChange={(e) => setEmail(e.target.value)} name="email"
            />
            Password
            <input
                type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} name="password"
            />
            <button type="submit">Login</button>
        </form>
    );
};
export default LogIn;
