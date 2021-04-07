import React, { useState, useContext, useEffect } from 'react';
// import innerText from "react-innertext";
import AuthContext from '../auth';
import correct from "../correct10.jpg";
import incorrect from "../incorrect10.jpeg";

const Submission = ({ qAndR, number, deploymentId }) => {
    let lastResponse = (qAndR.response === null) ? "" : String(qAndR.response);
    const [response, setResponse] = useState(String(lastResponse));
    const [grade, setGrade] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [,setErrors]= useState([]);
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);

    const putSubmission = async () => {
        let newResponse = response;
        while (newResponse && newResponse[0] === " ") newResponse = newResponse.slice(1);
        while (newResponse && newResponse[newResponse.length - 1] === " ") newResponse = newResponse.slice(0, -1);
        const res = await fetchWithCSRF(`/api/submissions/${deploymentId + " " + number}`,
            {
                method: 'PUT', headers: {"Content-Type": "application/json"},
                body: JSON.stringify({response: (newResponse === "") ? null : newResponse})
            }
        );
        const responseData = await res.json();
        if (!res.ok) return setErrors(responseData.errors);
        if (response !== "") setGrade(responseData.grade);
        setAnswer(responseData.answer);
    };

    useEffect(() => {
        putSubmission();
    });

    const handleSubmit = e => {
        e.preventDefault();
        putSubmission();
    }

    return <li>
        {/* <div dangerouslySetInnerHTML={{__html: qAndR.question}}></div> */}
        {/* {innerText(qAndR.question)} */}
        {qAndR.question}
        <form onSubmit={handleSubmit}>
            <span>
                <input
                    type="text"
                    placeholder="Response"
                    value={response}
                    onChange={e => setResponse(e.target.value)}
                />
                {/* Is this button unnecessary, by refactoring? */}
                <button type="submit">
                    Submit
                </button>
                {(grade === null) ? null
                    :
                        <img
                            src={grade ? correct : incorrect}
                            alt={grade ? "correct" : "incorrect"}
                        />
                }
            </span>
            {(currentUser.is_instructor) ? `answer: ${answer}` : null}
        </form>
    </li>
}
export default Submission;
