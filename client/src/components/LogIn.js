import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import AuthContext from '../auth'

const LogIn = ({ defaultUser }) => {
    const [email, setEmail] = useState(defaultUser);
    const [password, setPassword] = useState("password");
    const [errors, setErrors] = useState([]);
    const { fetchWithCSRF, setCurrentUser } = useContext(AuthContext);
    let history = useHistory();

    useEffect(() => (() => setEmail(defaultUser))(), [defaultUser])

    const putSession = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/session`, {
                method: 'PUT', headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password})
            });
            const responseData = await response.json();
            if (!response.ok) return setErrors(responseData.errors);
            setCurrentUser(responseData.current_user);
            history.push('/')
        })();
    };
    
    return (
        <form onSubmit={putSession}>
            {errors.map(err => <li key={err} className="error">{err}</li>)}
            Email
            <input
                type="text" placeholder="Email" value={email} size="25"
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
