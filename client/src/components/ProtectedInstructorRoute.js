import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from "../auth"

const ProtectedInstructorRoute = ({ component: Component, path, exact }) => {
    const { currentUser } = useContext(AuthContext)
    return (
        <Route
            path={path}
            exact={exact}
            render={props => (currentUser && currentUser.is_instructor)
                    ? <Component currentUser={currentUser} />
                    : <Redirect to="/login" />
            }
        />
    )
}
export default ProtectedInstructorRoute
