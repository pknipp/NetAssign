import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';
import EditQuestion from './EditQuestion';

const Question = ({ author, question, answer, inputs }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <li>
            <ul>
                <li> author: {author.email} </li>
                <li> question: {question} </li>
                <li> answer: {answer} </li>
                <li> inputs: {inputs} </li>
                { (currentUser.id === author.id) ?
                    <NavLink exact to={`/questions/${question.id}`} className="nav" activeClassName="active">
                        edit question
                    </NavLink>
                : null }
            </ul>
        </li>
    )
}
export default Question;
