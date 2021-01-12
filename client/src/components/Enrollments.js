import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Enrollments = () => {
    const [courses, setCourses] = useState([]);
    const [courseIds, setCourseIds] = useState([]);
    const [moreCourses, setMoreCourses] = useState([]);
    const [rerender, setRerender]=useState(false);
    const [showMoreCourses, setShowMoreCourses] = useState(false);
    const [messages, setMessages]=useState([]);
    const [errors, setErrors]   = useState([]);
    const { currentUser, fetchWithCSRF } = useContext(AuthContext)

    const getMyCourses = async () => {
        try {
            const res = await fetch(`/api/enrollments/`)
            if (res.ok) {
                const data = await res.json();
                setCourses(data.courses);
                setCourseIds(data.courses.map(course => course.course.id));
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getMyCourses();
    }, [rerender])

    const getMoreCourses = async () => {
        if (!showMoreCourses) {
            try {
                const res = await fetch(`/api/courses/`)
                if (res.ok) {
                    const data = await res.json();
                    setMoreCourses(data.courses);;
                }
            } catch (err) {
                console.error(err)
            }
        } else {
            setMoreCourses([]);
        }
        setShowMoreCourses(!showMoreCourses);
        setRerender(!rerender);
    }

    const deleteEnrollment = (e, courseId) => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/enrollments/${courseId}/`, {
                method: 'DELETE', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
        })();
    }

    const createEnrollment = (e, courseId) => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/enrollments/${courseId}/`, {
                method: 'POST', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
        })();
    }

    return (
        <>
            <p align="center">
                {courses.length ? `Classes in which I am now enrolled:` : `I am not enrolled in any classes.`}
            </p>
            <ul>
                {courses.map(course => (
                    <li key={course.course.id}>
                        <NavLink to={`/courses/${course.course.id}`}>
                            {course.course.name}
                        </NavLink>
                        {currentUser.is_instructor ? null :
                            <>
                                <button onClick={e => deleteEnrollment(e, course.course.id)}>drop</button>
                                {`(instructor: ${course.instructor.email})`}
                            </>
                        }
                    </li>
                ))}
            </ul>
            <button onClick={() => getMoreCourses()}>
                {showMoreCourses ? "Hide" : "Show"} classes in which I am not enrolled.
            </button>
            <ul>
                {moreCourses.filter(course => !courseIds.includes(course.id)).map(course => (
                    <li key={course.id}>
                        <>
                            <button onClick={e => createEnrollment(e, course.id)}>
                                add
                            </button>
                            {course.name}
                        </>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Enrollments
