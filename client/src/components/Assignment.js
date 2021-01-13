import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';
// import EditAssignment from './EditAssignment';

const Assignment = ({ assignment }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <li>
            <ul>
                <li> name: {assignment.assignment.name} </li>
                <li> author: {assignment.author.email}</li>
                <li> is public? {assignment.assignment.is_public ? "yes" : "no"}</li>
                <NavLink exact to={`/assignments/edit/${assignment.assignment.id}`} className="nav"activeClassName="active">
                    view{(currentUser.id === assignment.author.id) ? "/edit" : ""} assignment
                </NavLink>

            </ul>
        </li>
    )
}
export default Assignment;
