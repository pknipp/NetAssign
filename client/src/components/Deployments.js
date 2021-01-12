import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Deployments = ({ match }) => {
    let courseId = match.params.courseId;
    const [assignments, setAssignments] = useState([]);
    const [courseName, setCourseName] = useState("");
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/deployments/courses/${courseId}/`)
                if (res.ok) {
                    const data = await res.json();
                    setAssignments(data.assignments);
                    setCourseName(data.course_name);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [courseId])
    debugger
    return (
        <>
        <h3>Assignments for {courseName}:</h3>
        <ul>
            {(!assignments.length) ? null :
                assignments.map(assignment => (
                    <li key={assignment.assignment.id}>
                        {!currentUser.is_instructor ? null :
                        <NavLink to={`/deployments/${assignment.deployment.id}`}>
                            modify schedule
                        </NavLink>}
                        <NavLink to={`/submissions/${assignment.deployment.id}`}>
                            {assignment.assignment.name} (due {assignment.deployment.deadline})
                        </NavLink>
                    </li>
                ))
            }
        </ul>
        </>
    )
}

export default Deployments;
