import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from "../auth";

const AuthRoute = ({ component: Component, path, exact, ...rest }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <Route
            {...rest}
            path={path}
            exact={exact}
            render={() => currentUser ? <Redirect to="/" />
                : <Component {...rest} />
            }
        />
    )
}
export default AuthRoute
