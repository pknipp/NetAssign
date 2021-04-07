import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Enrollments = () => {
    const [courses, setCourses] = useState([]);
    const [courseIds, setCourseIds] = useState([]);
    const [moreCourses, setMoreCourses] = useState([]);
    const [rerender, setRerender]=useState(false);
    const [showMoreCourses, setShowMoreCourses] = useState(false);
    const [, setMessages]=useState([]);
    const [, setErrors]   = useState([]);
    const { currentUser, fetchWithCSRF } = useContext(AuthContext)

    const getMyCourses = async () => {
        try {
            const response = await fetch(`/api/enrollments/${currentUser.id + ' 0'}`)
            if (response.ok) {
                const data = await response.json();
                setCourses(data.courses);
                setCourseIds(data.courses.map(course => course.course.id));
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getMyCourses();
    }, [rerender])

    const getMoreCourses = async () => {
        if (!showMoreCourses) {
            try {
                const response = await fetch(`/api/courses`)
                if (response.ok) {
                    const data = await response.json();
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

    const deleteEnrollment = async (e, studentId, courseId) => {
        e.preventDefault();
        const response = await fetchWithCSRF(`/api/enrollments/${studentId + ' ' + courseId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        setErrors(data.errors || []);
        setMessages(data.messages || []);
        setRerender(!rerender);
    }

    const postEnrollment = async (studentId, courseId) => {
        const response = await fetchWithCSRF(`/api/enrollments/${studentId + ' ' + courseId}`, {
            method: 'POST',
        });
        const data = await response.json();
        setErrors(data.errors || []);
        setMessages(data.messages || [])
        setRerender(!rerender);
    }

    const duplicateCourse = async courseId => {
        const response = await fetchWithCSRF(`/api/courses/${courseId}`, {
            method: 'POST',
        });
        const data = await response.json();
        setErrors(data.errors || []);
        setMessages(data.messages || []);
        setRerender(!rerender);
    }

    return (
        <>
            <h3>
                {courses.length ? `My courses:` : `I have no courses now.`}
            </h3>
            {!currentUser.is_instructor ? null :
                <NavLink exact to={"/courses/edit/0"} className="nav" activeClassName="active">
                    create new course
                </NavLink>
            }
            <ul>
                {courses.map(course => (
                    <li key={course.course.id}>
                        <>
                            {currentUser.is_instructor ?
                                <>
                                    <NavLink to={`/courses/edit/${course.course.id}`}>
                                        edit
                                    </NavLink>
                                    <NavLink to={`/roster/${course.course.id}`}>
                                        roster
                                    </NavLink>
                                </>
                            :
                                <button onClick={e => deleteEnrollment(e, currentUser.id, course.course.id)}>
                                    Drop
                                </button>
                            }
                            <NavLink to={`/courses/${course.course.id}`}>
                                {course.course.name}
                            </NavLink>
                            {currentUser.is_instructor ? null :
                                <span>{`(instructor: ${course.instructor.email})`}</span>
                            }
                        </>
                    </li>
                ))}
            </ul>
            <>
                <span>
                    <button onClick={getMoreCourses}>
                        {showMoreCourses ? "Hide" : "Show"}
                    </button>
                    <> other courses.</>
                </span>
                {showMoreCourses ? <h3>Other courses:</h3> : null}
                <ul>
                    {moreCourses.filter(course => !courseIds.includes(course.id))
                        .map(course => (
                            <li key={course.id}>
                                <>
                                    <button onClick={() => {
                                        currentUser.is_instructor ? (
                                            duplicateCourse(course.id)
                                        ) : (
                                            postEnrollment(currentUser.id, course.id)
                                        )
                                    }}>
                                        {currentUser.is_instructor ? "Duplicate" : "Add"}
                                    </button>
                                    {course.name}
                                </>
                            </li>
                        ))
                    }
                </ul>
            </>
        </>
    )
}

export default Enrollments
