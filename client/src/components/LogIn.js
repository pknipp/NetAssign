import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import AuthContext from '../auth'

function LogIn(props) {
    const [usernameoremail, setUsernameoremail] = useState("dougthepug");
    const [password, setPassword] = useState("password");
    const [errors, setErrors] = useState([]);
    const { fetchWithCSRF, setCurrentUserId, setCurrentUser } = useContext(AuthContext);
    let history = useHistory();

    const submitForm = (e) => {
        e.preventDefault();

        // Make the following an IIFE?
        async function loginUser() {
            const response = await fetchWithCSRF(`/api/session/`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    usernameoremail,
                    password
                })
            });

            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                setCurrentUserId(responseData.current_user_id);
                setCurrentUser(responseData.current_user);
                history.push('/')
            }
        }
        loginUser();
    }
    return (
        <div className="authContain">
            <div className="authForm">
                <div className="authFormDiv">
                    <h1 style={{
                        margin: `22px auto 12px`,
                        fontSize: `3em`,
                        height: `20px`,
                        marginBlockStart: `1em`,
                        marginBlockEnd: `1em`
                    }}>Petstagram</h1>

                    <div className="authFormInnerWrap">
                        <form onSubmit={submitForm}>
                            {errors.length ? errors.map((err) => <li key={err} color="red">{err}</li>) : ''}
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
                            <button type="submit" className="button has-background-link has-text-white" style={{
                                height: `2rem`,
                                paddingLeft: `.5em`,
                                paddingRight: `.5em`,
                                margin: `8px 40px`,
                                fontWeight: `600`
                            }}>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogIn;
