import React, { useState, useContext, useEffect } from 'react';
// import innerText from "react-innertext";
import AuthContext from '../auth';
import correct from "../correct10.jpg";
import incorrect from "../incorrect10.jpeg";

const EditSubmission = ({ qAndR, number, deploymentId }) => {
    let lastResponse = (qAndR.response === null) ? "" : String(qAndR.response);
    const [studentResponse, setStudentResponse] = useState(String(lastResponse));
    const [grade, setGrade] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [errors,setErrors]= useState([]);
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);

    const putSubmission = async () => {
        let newStudentResponse = studentResponse;
        while (newStudentResponse && newStudentResponse[0] === " ") {
            newStudentResponse = newStudentResponse.slice(1);
        }
        while (newStudentResponse && newStudentResponse[newStudentResponse.length - 1] === " ") {
            newStudentResponse = newStudentResponse.slice(0, -1);
        }
        const response = await fetchWithCSRF(`/api/submissions/${deploymentId + " " + number}`,
            {
                method: 'PUT', headers: {"Content-Type": "application/json"},
                body: JSON.stringify({response: (newStudentResponse === "") ? null : newStudentResponse})
            }
        );
        const data = await response.json();
        if (!response.ok) {
            setErrors(data.errors);
            return setGrade(false);
        }
        if (response !== "") setGrade(data.grade);
        setErrors([]);
        setAnswer(data.answer);
    };

    useEffect(() => {
        putSubmission();
    }, [studentResponse]);

    // const handleSubmit = e => {
    //     e.preventDefault();
    //     putSubmission();
    // }

    return <li>
        {/* <div dangerouslySetInnerHTML={{__html: qAndR.question}}></div> */}
        {/* {innerText(qAndR.question)} */}
        {qAndR.question}
        <span>
            <input
                type="text"
                placeholder="Your response"
                value={studentResponse}
                onChange={e => setStudentResponse(e.target.value)}
            />
            <span className="error">{errors}</span>
            {(grade === null) ? null
                :
                    <img
                        src={grade ? correct : incorrect}
                        alt={grade ? "correct" : "incorrect"}
                    />
            }
        </span>
        {(currentUser.is_instructor) ? `answer: ${answer}` : null}
    </li>
}
export default EditSubmission;
