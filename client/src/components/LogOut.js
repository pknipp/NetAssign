import React, { useContext } from 'react';
import AuthContext from '../auth'

const LogOut = () => {
    const { fetchWithCSRF, setCurrentUser } = useContext(AuthContext);
    const deleteSession = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF('/api/session', {method: 'DELETE'});
            if (response.ok) setCurrentUser(null);
        })();
    }
    return (
        <form onSubmit={deleteSession}>
            <button type="submit">Logout</button>
        </form>
    );
};
export default LogOut;
