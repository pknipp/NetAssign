import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Enrollments = _ => {
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

    return (!courses.length) ? null :
        <ul>
            {courses.map(course => (
                <li key={course.course.id}>
                    <a href={`/${course.course.id}`}>{course.course.name}</a>
                </li>
            ))}
        </ul>
}


export default Enrollments
