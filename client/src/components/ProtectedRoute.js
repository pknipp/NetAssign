import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from "../auth"

const ProtectedRoute = ({ component: Component, path, exact }) => {
    const { currentUser } = useContext(AuthContext)
    return (
        <Route path={path} exact={exact} render={props => currentUser ? <Component currentUser={currentUser} /> : <Redirect to="/login" />} />
    )
}
export default ProtectedRoute
