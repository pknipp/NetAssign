import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../auth';
import correct from "../correct10.jpg";
import incorrect from "../incorrect10.jpeg";

const Question = ({ qAndR, number, deployment_id }) => {
    let lastResponse = (qAndR.response === null) ? "" : String(qAndR.response);
    const [response, setResponse] = useState(String(lastResponse));
    const [grade, setGrade] = useState(null);
    const [errors,setErrors]= useState([]);
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);

    const gradeIt = async _ => {
        if (response !== "") {
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
        }
    };

    useEffect(() => gradeIt(), [])
    const handleSubmit = e => {
        e.preventDefault();
        gradeIt();
    }

    return <li key={qAndR.id}>
        {qAndR.question}<br/>
        <form onSubmit={handleSubmit}>
            <span>
                <input
                    type="text" placeholder="Answer" value={response}
                    onChange={e => setResponse(e.target.value)}
                />
                <button type="submit">
                    Submit
                </button>
                {(grade === null) ? null : <img src={grade ? correct : incorrect} />}
            </span>
        </form>
    </li>
}
export default Question;
