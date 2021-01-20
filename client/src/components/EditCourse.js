import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth'


const EditCourse = ({ match }) => {
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);
    const courseId = Number(match.params.courseId);
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const history = useHistory();

    useEffect(() => {
        debugger
        if (courseId > 0) {
        (async () => {
            try {
                const res = await fetch(`/api/courses/${courseId}`)
                if (res.ok) {
                    debugger
                    const data = await res.json();
                    setName(data.course.name);
                    setIsPublic(data.course.is_public);
                    setCanEdit(data.course.instructor_id === currentUser.id);
                }
            } catch (err) {
                console.error(err)
            }
        })()}
    }, [rerender])

    const putCourse = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/courses/${courseId}`, {
                method: 'PUT', headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ name, isPublic })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender)
            history.push("/")
        })();
    }

    const postCourse = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/courses`, {
                method: 'POST', headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ name })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
            history.push("/")
        })();
    }

    const duplicateCourse = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/courses/${courseId}`, {
                method: 'POST',
                // headers: {"Content-Type": "application/json"},
                // credentials: 'include', body: JSON.stringify({})
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/")
        })();
    }

    const deleteCourse = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/courses/${courseId}`, {
                method: 'DELETE',
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            setRerender(!rerender);
            history.push("/")
        })();
    }

    return (
        <>
            {errors.length ? errors.map(err => <li key={err}>{err}</li>) : ''}
            <input
                type="text" placeholder="Name" value={name}
                onChange={e => setName(e.target.value)} name="name"
            />
            {(!canEdit && courseId) ? null : (
                <span>
                    {isPublic ? "public " : "private "}
                    <button onClick={() => {setIsPublic(!isPublic)}}>
                        toggle
                    </button>
                    <br/>
                    <button onClick={courseId ? putCourse : postCourse}>
                        {courseId ? "Submit changes" : "Create course"}
                    </button>
                </span>
            )}

            {!courseId ? null :
                <>
                    <>{messages.map(err => <li key={err}>{err}</li>)}</>
                    <h4>Would you like to duplicate or delete this course?</h4>
                    <span>
                        <button onClick={() => duplicateCourse()}>Duplicate it</button>
                        <button onClick={() => deleteCourse()}>Delete it</button>
                    </span>
                </>
            }
        </>
    );
};

export default EditCourse;
