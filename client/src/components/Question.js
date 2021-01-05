import React, { useState, useContext } from 'react';
import AuthContext from '../auth';

const Question = ({ questionAndResponse, number, deployment_id }) => {
    const [response, setResponse] = useState(String(questionAndResponse.response));
    const [grade, setGrade] = useState(false);
    const [errors,setErrors]= useState([]);
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);

    const handleSubmit = e => {
        e.preventDefault();
        (async _ => {
            const res = await fetchWithCSRF(
                `/api/submissions/${deployment_id + " " + currentUser.id + " " + number}`, {
                method: 'PUT', headers: {"Content-Type": "application/json"},
                credentials: 'include', body: JSON.stringify({response: Number(response)})
            });
            const responseData = await res.json();
            if (!res.ok) {
                setErrors(responseData.errors);
            } else {
                setGrade(responseData.grade);
                // history.push('/')
            }
        })();
    }

    return <li key={questionAndResponse.id}>
        {questionAndResponse.question}<br/>
        <form onSubmit={handleSubmit}>
            <input
                type="number" placeholder="Answer" value={response}
                onChange={e => setResponse(e.target.value)}
            />
            <button type="submit">submit</button>
            {!(response) ? "" : grade ? "right" : "wrong"}
        </form>
    </li>
}
export default Question;
