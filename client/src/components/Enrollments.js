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
            const res = await fetch(`/api/enrollments/${currentUser.id + ' 0'}`)
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
                const res = await fetch(`/api/courses`)
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

    const deleteEnrollment = (e, studentId, courseId) => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/enrollments/${studentId + ' ' + courseId}`, {
                method: 'DELETE',
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
        })();
    }

    const postEnrollment = (studentId, courseId) => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/enrollments/${studentId + ' ' + courseId}`, {
                method: 'POST',
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
        })();
    }

    const duplicateCourse = courseId => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/courses/${courseId}`, {
                method: 'POST',
                // headers: {"Content-Type": "application/json"},
                // credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
            // history.push("/")
        })();
    }

    return (
        <>
            {!currentUser.is_instructor ? null :
                <NavLink exact to={"/courses/edit/0"} className="nav" activeClassName="active">
                    create new course
                </NavLink>
            }
            <h3>
                {courses.length ? `My classes:` : `I have no classes now.`}
            </h3>
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
                        <button onClick={() => getMoreCourses()}>
                            {showMoreCourses ? "Hide" : "Show"}
                        </button>
                        <> other classes.</>
                    </span>
                    {showMoreCourses ? <h3>Other classes:</h3> : null}
                    <ul>
                        {moreCourses.filter(course => !courseIds.includes(course.id)).map(course => (
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
                        ))}
                    </ul>
                </>

        </>
    )
}

export default Enrollments
