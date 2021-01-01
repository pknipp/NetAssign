import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import LogOut from './components/LogOut';
import EditUser from './components/EditUser';
import ProtectedRoute from "./components/ProtectedRoute"
import AuthRoute from "./components/AuthRoute"
import AuthContext from './auth';
import PostContext from './PostContext';
import Success from './components/Success';


function App() {
    const [fetchWithCSRF, setFetchWithCSRF] = useState(() => fetch);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true)
    const [postData, setPostData] = useState(null)
    const [updatedPosts, setUpdatedPosts] = useState(false);
    const [updatedComments, setUpdatedComments] = useState(false);
    const authContextValue = {
        fetchWithCSRF,
        currentUserId,
        setCurrentUserId,
        currentUser,
        setCurrentUser
    };

    const postContextValue = {
        postData,
        setPostData,
        updatedPosts,
        setUpdatedPosts,
        updatedComments,
        setUpdatedComments,
    };

    useEffect(() => {
        (async () => {
            const response = await fetch('/restore')
            const data = await response.json()
            const { current_user_id, current_user } = data
            setCurrentUserId(current_user_id)
            setCurrentUser(current_user)
            setLoading(false)
        })()

    }, [])

    return (
        <AuthContext.Provider value={authContextValue}>
            <PostContext.Provider value={postContextValue}>
                {loading && <h1 style={{
                    textAlign: `center`,
                    background: `white`,
                    fontSize: `3em`,
                    lineHeight: `7em`
                }}>Loading</h1>}
                {!loading &&
                    <BrowserRouter>
                        <Navbar currentUserId={currentUserId} currentUser={currentUser} />
                        <Switch>
                            <AuthRoute exact path="/login" component={LogIn} />
                            <AuthRoute exact path="/signup" component={SignUp} />
                            <ProtectedRoute exact path="/logout" component={LogOut} currentUserId={currentUserId} />
                            <ProtectedRoute exact path="/edituser" component={EditUser} currentUser={currentUser} currentUserId={currentUserId} />
                            <ProtectedRoute exact path="/" component={Success} currentUserId={currentUserId} />
                        </Switch>
                    </BrowserRouter>
                }
            </PostContext.Provider>
        </AuthContext.Provider>
    );
}

export default App;
