import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from "../auth"

const ProtectedRoute = ({ component: Component, path, exact, ...rest}) => {
    const { currentUser } = useContext(AuthContext)
    return (
        <Route
            {...rest}
            path={path}
            exact={exact}
            render={props => currentUser
                ? <Component currentUser={currentUser} {...rest} />
                : <Redirect to="/welcome" />
            }
        />
    )
}
export default ProtectedRoute
