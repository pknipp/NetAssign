import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from "../auth"

const ProtectedRoute = ({ component: Component, path, exact }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <Route path={path} exact={exact} render={props => currentUser ? <Redirect to="/" /> : <Component />} />
    )
}
export default ProtectedRoute
