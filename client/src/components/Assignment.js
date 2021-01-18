import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Assignment = ({ assignment }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <ul>
            <li> name: {assignment.name} </li>
            <li>
                {(currentUser.id === assignment.owner.id) ?
                    <>is public? {assignment.is_public ? "yes" : "no"}</>
                :
                    <>owner: {assignment.owner.email}</>
                }
            </li>
            <li>
                <NavLink exact to={`/assignments/${assignment.id}`} className="nav"activeClassName="active">
                    {(currentUser.id === assignment.owner.id) ? "edit" : "view"}/duplicate assignment
                </NavLink>
            </li>
        </ul>
    )
}
export default Assignment;
