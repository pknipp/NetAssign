import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';
import EditQuestion from './EditQuestion';

const Question = ({ question }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <li>
            <ul>
                <li> author: {question.author.email} </li>
                <li> question: {question.question} </li>
                <li> answer: {question.answer} </li>
                <li> inputs: {question.inputs} </li>
                { (currentUser.id === question.author.id) ?
                    <NavLink exact to={`/questions/${question.id}`} className="nav" activeClassName="active">
                        edit question
                    </NavLink>
                : null }
            </ul>
        </li>
    )
}
export default Question;
