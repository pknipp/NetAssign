import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import AuthContext from '../auth';
import ToggleInfo from './ToggleInfo';

const EditCourse = ({ match }) => {
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);
    const courseId = Number(match.params.courseId);
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [showInfo, setShowInfo] = useState({});
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const history = useHistory();
    const text = {
        privacy: "This controls whether or not other instructors will be able to see, use, and/or duplicate this course.  (Regardless they'll not have edit/delete privileges.)",
    };

    useEffect(() => {
        if (courseId > 0) {
        (async () => {
            try {
                const res = await fetch(`/api/courses/${courseId}`);
                const data = await res.json();
                if (!res.ok) {
                    setErrors(data.errors);
                } else {
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
            const response = await fetchWithCSRF(`/api/courses/${courseId}`, {method: 'POST'});
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                if (responseData.messages) setMessages(responseData.messages);
                history.push("/");
            }
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

    const handleToggle = e => {
        let name = e.currentTarget.name;
        let newShowInfo = {...showInfo};
        newShowInfo[name] = !showInfo[name];
        setShowInfo(newShowInfo);
    }

    return !currentUser.is_instructor ? <Redirect to="/login" /> : (
        <>
            <h2>Course Editor</h2>
            {errors.length ? errors.map(err => <li key={err} className="error">{err}</li>) : ''}
            <input
                type="text" placeholder="Name of new course" value={name}
                onChange={e => setName(e.target.value)} className="larger"
                disabled={!canEdit && courseId}
            />
            {(!canEdit && courseId) ? null : (
                <>
                    <h4>
                        privacy setting:
                        <ToggleInfo onClick={handleToggle} name="privacy" toggle={showInfo.privacy} />
                    </h4>
                    <div><i>{showInfo.privacy ? text.privacy : null}</i></div>
                    {isPublic ? "public " : "private "}
                    <button onClick={() => setIsPublic(!isPublic)}>toggle</button>
                    <button onClick={courseId ? putCourse : postCourse}>
                        <h3>{courseId ? "Submit changes" : "Create course"}</h3>
                    </button>
                </>
            )}

            {!courseId ? null :
                <>
                    <>{messages.map(err => <li key={err}>{err}</li>)}</>
                    <h4>Would you like to duplicate
                        {!canEdit && courseId ? " " :
                        " or delete "}
                        this course?</h4>
                    <span>
                        <button onClick={() => duplicateCourse()}><h3>duplicate</h3></button>
                        {!canEdit && courseId ? null :
                        <button onClick={() => deleteCourse()}><h3>delete</h3></button>}
                    </span>
                </>
            }
        </>
    );
};

export default EditCourse;
