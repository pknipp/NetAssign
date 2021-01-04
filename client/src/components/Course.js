import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../auth'

const Course = ({ match }) => {
    let course_id = match.params.course_id
    // const [courses, setCourses] = useState([])
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/enrollments/${currentUser.id}`)
                if (res.ok) {
                    const data = await res.json();
                    // setCourses(data.courses);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [currentUser.id])

    return <h3>{match.params.course_id}</h3>
}


export default Course;
