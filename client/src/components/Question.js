import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Question = ({ question }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <li>
            <ul>
                <li> question: {question.question} </li>
                <li> answer: {question.answer} </li>
                <li> inputs: {question.inputs} </li>
                <li>
                    {(currentUser.id === question.owner.id) ? (
                        <>is public? {question.is_public ? "yes" : "no"}</>
                    ) : (
                        <>author: {question.owner.email}</>
                    )}
                </li>
            </ul>
            <NavLink exact to={`/questions/${question.id}`} className="nav" activeClassName="active">
                {(currentUser.id === question.owner.id) ? "edit" : "view"}/duplicate question
            </NavLink>
        </li>
    )
}
export default Question;
