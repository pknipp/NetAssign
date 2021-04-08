import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Question = ({ question }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <li>
            <NavLink exact to={`/questions/${question.id}`} className="nav" activeClassName="active">
                {(currentUser.id === question.owner.id) ? "edit" : "view"}/duplicate
            </NavLink>
            {question.question}
        </li>
    )
}
export default Question;
