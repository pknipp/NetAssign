import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Question = ({ question }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <li>
            <ul>
                <li> author: {question.author.email} </li>
                <li> question: {question.question} </li>
                <li> answer: {question.answer} </li>
                <li> inputs: {question.inputs} </li>
                {(currentUser.id !== question.author.id) ? null :
                    <li> is public? {question.is_public ? "yes" : "no"}</li>
                }
            </ul>
            <NavLink exact to={`/questions/${question.id}`} className="nav" activeClassName="active">
                {(currentUser.id === question.author.id) ? "edit" : "view"} question
            </NavLink>
        </li>
    )
}
export default Question;
