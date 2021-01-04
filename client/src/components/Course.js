import React, { useEffect, useState } from 'react'
// import AuthContext from '../auth'

const Course = ({ match }) => {
    let course_id = match.params.course_id
    const [assignments, setAssignments] = useState([])
    // const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/deployments/${course_id}`)
                if (res.ok) {
                    const data = await res.json();
                    setAssignments(data.assignments);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [course_id])

    return (
        <>
        <h3>Assignments for this class:</h3>
        <ul>
            {(!assignments.length) ? null :
                assignments.map(assignment => (
                    <li key={assignment.id}>{assignment.name}</li>
                ))
            }
        </ul>
        </>
    )
}


export default Course;
