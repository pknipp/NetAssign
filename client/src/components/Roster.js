import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../auth';

const Roster = ({ match }) => {
    let courseId = match.params.courseId;
    const [students, setStudents] = useState([]);
    const [studentIds, setStudentIds] = useState([]);
    const [moreStudents, setMoreStudents] = useState([]);
    const [rerender, setRerender]=useState(false);
    const [showMoreStudents, setShowMoreStudents] = useState(false);
    const [, setMessages]=useState([]);
    const [, setErrors]   = useState([]);
    const { currentUser, fetchWithCSRF } = useContext(AuthContext)

    const getMyStudents = async () => {
        try {
            const res = await fetch(`/api/enrollments/${'0 ' + courseId}`)
            if (res.ok) {
                const data = await res.json();
                setStudents(data.students);
                setStudentIds(data.students.map(student => student.id));
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getMyStudents();
    }, [rerender])

    const getMoreStudents = async () => {
        if (!showMoreStudents) {
            try {
                const res = await fetch(`/api/users`)
                if (res.ok) {
                    const data = await res.json();
                    setMoreStudents(data.students);;
                }
            } catch (err) {
                console.error(err)
            }
        } else {
            setMoreStudents([]);
        }
        setShowMoreStudents(!showMoreStudents);
        setRerender(!rerender);
    }

    const deleteEnrollment = (e, studentId) => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/enrollments/${studentId + ' ' + courseId}`, {
                method: 'DELETE',
                // headers: {"Content-Type": "application/json"},
                // credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
        })();
    }

    const postEnrollment = (e, studentId) => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/enrollments/${studentId + ' ' + courseId}`, {
                method: 'POST',
                // headers: {"Content-Type": "application/json"},
                // credentials: 'include', body: JSON.stringify({})
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
                {students.length ? `My current students:` : `I have no students now.`}
            </p>
            <ul>
                {students.map(student => (
                    <li key={student.id}>
                        <>
                            <button onClick={e => deleteEnrollment(e, student.id)}>drop</button>
                            {student.email}
                        </>
                    </li>
                ))}
            </ul>

            {!currentUser.is_instructor ? null :
                <>
                    <button onClick={() => getMoreStudents()}>
                        {showMoreStudents ? "Hide" : "Show"} students who are not enrolled in this course.
                    </button>
                    <ul>
                        {moreStudents.filter(student => !studentIds.includes(student.id)).map(student => (
                            <li key={student.id}>
                                <>
                                    <button onClick={e => postEnrollment(e, student.id)}>
                                        add
                                    </button>
                                    {student.email}
                                </>
                            </li>
                        ))}
                    </ul>
                </>
            }
        </>
    )
}

export default Roster;
