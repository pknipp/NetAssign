import React, { useContext } from 'react';
// import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'

const LogOut = () => {
    // const history = useHistory();
    // const [errors, setErrors] = useState("");
    const { fetchWithCSRF, setCurrentUser } = useContext(AuthContext);
    const deleteSession = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF('/api/session', {
                method: 'DELETE',
                // credentials: 'include'
            });
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
