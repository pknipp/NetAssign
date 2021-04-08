import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Assignment = ({ assignment }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <li>
            <NavLink
                exact to={`/assignments/${assignment.id}`}
                className="nav"activeClassName="active"
            >
                {(currentUser.id === assignment.owner.id) ? "edit" : "view"}/duplicate
            </NavLink>
            {assignment.name}
        </li>
    )
}
export default Assignment;
