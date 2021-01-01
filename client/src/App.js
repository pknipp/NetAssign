import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import LogOut from './components/LogOut';
import EditUser from './components/EditUser';
import ProtectedRoute from "./components/ProtectedRoute"
import AuthRoute from "./components/AuthRoute"
import AuthContext from './auth';
import Success from './components/Success';


const App = _ => {
    const [fetchWithCSRF, setFetchWithCSRF] = useState(() => fetch);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true)
    const authContextValue = {
        fetchWithCSRF,
        currentUser,
        setCurrentUser
    };

    useEffect(() => {
        (async () => {
            const response = await fetch('/restore');
            const data = await response.json();
            setCurrentUser(data.current_user);
            setLoading(false);
        })()
    }, [])

    return (
        <AuthContext.Provider value={authContextValue}>
            {loading ?
                <h1>Loading</h1>
            :
                <BrowserRouter>
                    <NavBar currentUser={currentUser} />
                    <Switch>
                        <AuthRoute exact path="/login" component={LogIn} />
                        <AuthRoute exact path="/signup" component={SignUp} />
                        <ProtectedRoute exact path="/logout" component={LogOut} currentUser={currentUser} />
                        <ProtectedRoute exact path="/edituser" component={EditUser} currentUser={currentUser} />
                        <ProtectedRoute exact path="/" component={Success} />
                    </Switch>
                </BrowserRouter>
            }
        </AuthContext.Provider>
    );
}

export default App;
