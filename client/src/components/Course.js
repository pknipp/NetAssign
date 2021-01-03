import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../auth'

const Course = props => {
    const [courses, setCourses] = useState([])
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/enrollments/${currentUser.id}`)
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data.courses);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [currentUser.id])

    return <h3>{Object.keys(props)[0]}</h3>
}


export default Course;
