import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Assignment = ({ assignment }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <li>
            <ul>
                <li> name: {assignment.assignment.name} </li>
                <li> author: {assignment.author.email}</li>
                {(currentUser.id !== assignment.author.id) ? null :
                    <li> is public? {assignment.is_public ? "yes" : "no"}</li>
                }
            </ul>
            <NavLink exact to={`/assignments/edit/${assignment.assignment.id}`} className="nav"activeClassName="active">
                {(currentUser.id === assignment.author.id) ? "edit" : "view"}/duplicate assignment
            </NavLink>
        </li>
    )
}
export default Assignment;
