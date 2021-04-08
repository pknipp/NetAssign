import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';
// import Assignment from './Assignment';

const Deployments = ({ match }) => {
    let courseId = match.params.courseId;
    const [assignments, setAssignments] = useState([]);
    const [otherAssignments, setOtherAssignments] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [showMoreAssignments, setShowMoreAssignments] = useState(false);
    // const [showOtherAssignment, setShowOtherAssignment] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const getDeployments = async () => {
        try {
            const response = await fetch(`/api/deployments/courses/${courseId}`)
            if (response.ok) {
                const data = await response.json();
                setAssignments(data.assignments);
                setOtherAssignments(data.other_assignments);
                setCourseName(data.course_name);
            }
        } catch (err) {
            console.error(err)
        }
    };

    useEffect(() => {
        getDeployments();
    }, [courseId]);

    return (
        <>
            <h3>Deployed assignments for {courseName}:</h3>
            <ul>
                {(!assignments.length) ? null
                    :
                        assignments.map(assignment => (
                            <li key={assignment.deployment.id}>
                                {!currentUser.is_instructor ? null
                                    :
                                        <NavLink
                                            to={`/deployments/${assignment.deployment.id}`}
                                        >
                                            modify deadline
                                        </NavLink>
                                }
                                <NavLink
                                    to={`/submissions/${assignment.deployment.id}`}
                                >
                                    {assignment.assignment.name}&nbsp;
                                </NavLink>
                                (due {assignment.deployment.deadline})
                            </li>
                        ))
                }
            </ul>

            {!currentUser.is_instructor ? null : <span>
                <button
                    onClick={() => setShowMoreAssignments(!showMoreAssignments)}
                >
                    {showMoreAssignments ? "Hide " : "Show "}
                </button>
                <span padding-left={"10px"}>
                    undeployed assignments
                </span>
            </span>}

            {!showMoreAssignments ? null :
                <>
                    <h3>
                        Undeployed assignments owned by me:
                    </h3>
                    <ul>
                        {otherAssignments.filter(assignment => assignment.assignment.instructor_id === currentUser.id)
                            .map(assignment => (
                                <li key={assignment.assignment.id}>
                                    <NavLink
                                        exact to={
                                            `/deployments/0 ${assignment.assignment.id} ${courseId}`
                                        }
                                        className="nav"
                                        activeClassName="active"
                                    >
                                        view and deploy
                                    </NavLink>
                                    {assignment.assignment.name}
                                </li>
                            ))
                        }
                    </ul>

                    <h3>Undeployed assignments owned by others:</h3>
                    <ul>
                        {otherAssignments.filter(assignment => assignment.assignment.instructor_id !== currentUser.id)
                            .map(assignment => (
                                <li key={assignment.assignment.id}>
                                    <NavLink
                                        exact to={`/deployments/0 ${assignment.assignment.id} ${courseId}`} className="nav"activeClassName="active"
                                    >
                                        view and deploy
                                    </NavLink>
                                    {assignment.assignment.name}
                                </li>
                            ))
                        }
                    </ul>
                </>
            }
        </>
    )
}

export default Deployments;
