import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Question = ({ question }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <ul>
            <li> encoded question string: {question.question} </li>
            <li> encoded answer string: {question.answer} </li>
            <li> inputs: {question.inputs} </li>
            <li>
                {(currentUser.id === question.owner.id) ? (
                    <>is public? {question.is_public ? "yes" : "no"}</>
                ) : (
                    <>author: {question.owner.email}</>
                )}
            </li>
            <li>
                <NavLink exact to={`/questions/${question.id}`} className="nav" activeClassName="active">
                    {(currentUser.id === question.owner.id) ? "edit" : "view"}/duplicate question
                </NavLink>
            </li>
        </ul>
    )
}
export default Question;
