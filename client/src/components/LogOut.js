import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'

const LogOut = ({ currentUser }) => {
    const history = useHistory();
    debugger
    // const [errors, setErrors] = useState("");
    const { fetchWithCSRF, setCurrentUser } = useContext(AuthContext);
    debugger
    const submitForm = e => {
        debugger
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF('/api/session/', {
                method: 'DELETE', credentials: 'include'
            });
            if (response.ok) setCurrentUser(null);
            // history.push("/");
        })();
    }
    debugger
    return (
        <form onSubmit={submitForm}>
            <button type="submit">Logout</button>
        </form>
    );
};
export default LogOut;
