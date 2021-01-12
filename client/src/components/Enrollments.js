import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Enrollments = () => {
    const [courses, setCourses] = useState([])
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/enrollments/`)
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data.courses);
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [currentUser.id])

    return (
        <>
            <p align="center">My classes:</p>
            {(!courses.length) ? null :
            <ul>
                {courses.map(course => (
                    <li key={course.course.id}>
                        <NavLink to={`/courses/${course.course.id}`}>
                            {course.course.name}
                        </NavLink>
                        (instructor: {course.instructor.email})
                    </li>
                ))}
            </ul>}
        </>
    )
}


export default Enrollments
