import React, { useState, useContext, useEffect } from 'react';
import innerText from "react-innertext";
import AuthContext from '../auth';
import correct from "../correct10.jpg";
import incorrect from "../incorrect10.jpeg";

const Question = ({ qAndR, number, deployment_id }) => {
    let lastResponse = (qAndR.response === null) ? "" : String(qAndR.response);
    const [response, setResponse] = useState(String(lastResponse));
    const [grade, setGrade] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [errors,setErrors]= useState([]);
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);

    const gradeIt = async _ => {
        const res = await fetchWithCSRF(
            `/api/submissions/${deployment_id + " " + currentUser.id + " " + number}`, {
            method: 'PUT', headers: {"Content-Type": "application/json"},
            credentials: 'include', body: JSON.stringify({response: (response === "") ? null : Number(response)})
        });
        const responseData = await res.json();
        if (!res.ok) {
            setErrors(responseData.errors);
        } else {
            if (response !== "") setGrade(responseData.grade);
            setAnswer(responseData.answer);
            // history.push('/')
        }
    };

    useEffect(() => gradeIt(), [])
    const handleSubmit = e => {
        e.preventDefault();
        gradeIt();
    }

    return <li key={qAndR.id}>
        {/* <div dangerouslySetInnerHTML={{__html: qAndR.question}}></div> */}
        {/* {innerText(qAndR.question)} */}
        {qAndR.question}
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
            {(currentUser.is_instructor) ? answer : null}
        </form>
    </li>
}
export default Question;
