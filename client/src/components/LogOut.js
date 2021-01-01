import React, { useState, useContext } from 'react';
import AuthContext from '../auth'

const LogOut = props => {
    const [errors, setErrors] = useState("");
    const { fetchWithCSRF, setCurrentUserId, setCurrentUser } = useContext(AuthContext);

    const submitForm = e => {
        e.preventDefault();
        // Make the following an IIFE?
        const logoutUser = async _ => {
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
        <form onSubmit={submitForm}>
            {errors.length ? errors.map((err) => <li key={err} >{err}</li>) : ''}
            <button type="submit">Logout</button>
        </form>
    );
};

export default LogOut;
