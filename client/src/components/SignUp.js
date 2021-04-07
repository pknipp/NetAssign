import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../auth';

const SignUp = props => {
    const [email, setEmail] = useState('');
    const [isInstructor, setIsInstructor] = useState(props.isInstructor)
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('')
    const { fetchWithCSRF, setCurrentUser } = useContext(AuthContext);
    const [errors, setErrors] = useState([]);

    useEffect(() => (() => setIsInstructor(isInstructor))(), [isInstructor])

    const postUser = async e => {
        e.preventDefault();
        const response = await fetchWithCSRF(`/api/users`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, password2, isInstructor })
        });
        const data = await response.json();
        setErrors(data.errors || []);
        if (response.ok) setCurrentUser(data.current_user);
    };

    return (
        <form onSubmit={postUser}>
            {errors.map(err => <li key={err} className="error">{err}</li>)}
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                name="email"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                name="password"
            />
            <input
                type="password"
                placeholder="Confirm password"
                value={password2}
                onChange={e => setPassword2(e.target.value)}
                name="password2"
            />
            <button type="submit">Sign Up</button>
        </form>
    );
};
export default SignUp;
