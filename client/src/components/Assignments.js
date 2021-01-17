import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth'
import Assignment from './Assignment';


const Assignments = () => {
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);
    const [, setErrors] = useState([]);
    const [, setMessages] = useState([]);
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await fetchWithCSRF("/api/assignments");
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else if (responseData.messages) {
                setMessages(responseData.messages);
            } else {
                setAssignments(responseData.assignments);
            }
        })();
    }, [])

    return (
        <>
            <NavLink exact to={"/assignments/edit/0"} className="nav" activeClassName="active">
                create new assignment
            </NavLink>
            {assignments.map(assignment => {
                return (
                    <ul>
                        <Assignment
                            key={`aid${assignment.assignment.id}`} assignment={assignment} />
                    </ul>
                )
            })}
        </>
    )
};

export default Assignments;
