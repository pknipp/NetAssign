import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'


const EditCourse = ({ match }) => {
    const courseId = Number(match.params.courseId);
    const { fetchWithCSRF } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [rerender, setRerender] = useState(false);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (courseId > 0) {
        (async () => {
            try {
                const res = await fetch(`/api/courses/${courseId}`)
                if (res.ok) {
                    const data = await res.json();
                    setName(data.course.name);
                }
            } catch (err) {
                console.error(err)
            }
        })()}
    }, [rerender])

    const putCourse = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/courses/${courseId}`, {
                method: 'PUT', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ name })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push(`/courses`)
        })();
    }

    const postCourse = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF("/api/courses/", {
                method: 'POST', headers: {"Content-Type": "application/json"}, credentials: 'include',
                body: JSON.stringify({ name })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/courses")
        })();
    }

    const deleteCourse = e => {
        e.preventDefault();
        (async _ => {
            const response = await fetchWithCSRF(`/api/courses/${courseId}`, {
                method: 'DELETE', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/")
        })();
    }

    return (
        <>
            <form onSubmit={courseId ? putCourse : postCourse}>
                {errors.length ? errors.map(err => <li key={err}>{err}</li>) : ''}
                <input
                    type="text" placeholder="Name" value={name}
                    onChange={e => setName(e.target.value)} name="name" />
                <button type="submit">Submit Change</button>
            </form>

            {courseId ? <form onSubmit={deleteCourse}>
                {messages.map(err => <li key={err}>{err}</li>)}
                <h4>Would you like to delete this course?</h4>
                <button type="submit">Delete course</button>
            </form> : null}
        </>
    );
};

export default EditCourse;
