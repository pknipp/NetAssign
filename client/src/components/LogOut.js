import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import AuthContext from '../auth'

function LogOut(props) {
    const [errors, setErrors] = useState("");
    const { fetchWithCSRF, setCurrentUserId, setCurrentUser } = useContext(AuthContext);
    let history = useHistory();

    const submitForm = (e) => {
        e.preventDefault();
        // Make the following an IIFE?
        const logoutUser = async () => {
            const response = await fetchWithCSRF('/api/session/', {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setCurrentUserId(null);
                setCurrentUser(null);
            }
        }
        logoutUser();
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
                            {errors.length ? errors.map((err) => <li key={err} >{err}</li>) : ''}
                            <button type="submit" className="button has-background-link has-text-white" style={{
                                height: `2rem`,
                                paddingLeft: `.5em`,
                                paddingRight: `.5em`,
                                margin: `8px 40px`,
                                fontWeight: `600`
                            }}>Logout</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogOut;
