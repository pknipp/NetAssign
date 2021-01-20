import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth';
import Input from './Input';


const EditQuestion = ({ match }) => {
    const questionId = Number(match.params.questionId)  ;
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);
    const [question, setQuestion] = useState('');
    const [canEdit, setCanEdit] = useState(false);
    const [answer, setAnswer] = useState('');
    const [inputLength, setInputLength] = useState(0);
    const [inputs, setInputs] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const [, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (questionId > 0) {
        (async () => {
            try {
                const res = await fetch(`/api/questions/${questionId}`)
                if (res.ok) {
                    const data = await res.json();
                    setQuestion(data.question_answer_inputs.question);
                    setAnswer(data.question_answer_inputs.answer);
                    setInputs(data.question_answer_inputs.inputs);
                    setInputLength(data.question_answer_inputs.inputs.length);
                    setIsPublic(data.question_answer_inputs.is_public);
                    setCanEdit(data.question_answer_inputs.instructor_id === currentUser.id);
                }
            } catch (err) {
                console.error(err)
            }
        })()}
    }, [])

    const putQuestion = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/questions/${questionId}`, {
                method: 'PUT', headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ question, answer, inputs, isPublic })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/questions")
        })();
    }

    const postQuestion = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/questions`, {
                method: 'POST', headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ question, answer, inputs, isPublic })
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/questions")
        })();
    }

    const duplicateQuestion = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/questions/${questionId}`, {
                method: 'POST',
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/questions")
        })();
    }

    const deleteQuestion = () => {
        (async _ => {
            const response = await fetchWithCSRF(`/api/questions/${questionId}`, {
                method: 'DELETE',
            });
            const responseData = await response.json();
            if (!response.ok) setErrors(responseData.errors);
            if (responseData.messages) setMessages(responseData.messages)
            history.push("/questions")
        })();
    }
    return (
        <>
            <span>
                <button onClick={
                    () => {
                    let newInputLength = inputLength + 1;
                    let newInputs = [...JSON.parse(JSON.stringify(inputs)), []];
                    setInputLength(newInputLength)
                    setInputs(newInputs);
                }}>
                    increase
                </button>
                {!inputLength ? null : <button onClick={
                    () => {
                    let newInputLength = inputLength - 1;
                    let newInputs = JSON.parse(JSON.stringify(inputs)).slice(0, -1);
                    setInputLength(newInputLength)
                    setInputs(newInputs);
                }}>
                    decrease
                </button>}
                <> (from <>{inputLength}</>) the number of randomized variables in this question</>
            </span>
            {!inputLength ? null : <table>
                <thead>
                    <tr>
                         <th>variable</th>
                         <th>min<br/> value</th>
                         <th>max<br/> value</th>
                         <th># of<br/> divisions</th>
                    </tr>
                </thead>
                <tbody>
                    {!(inputs.length) ? null : (
                        inputs.map((input, row, inputs) => (
                            <tr>
                                <Input key={row} row={row} input={input} inputs={inputs} setInputs={setInputs} />
                            </tr>
                        ))
                    )}
                </tbody>
            </table>}
            <span>
                encoded question string:
                <textarea
                    placeholder="Question" value={question} name="question" rows="3" cols="50"
                    onChange={e => setQuestion(e.target.value)} disabled={!canEdit && questionId}
                />
            </span>
            <span>
                encoded answer string:
                <input
                    type="text" placeholder="Answer" value={answer} name="answer"
                    onChange={e => setAnswer(e.target.value)} disabled={!canEdit && questionId}
                />
            </span>
            {/* <input
                type="text" placeholder="Inputs" value={inputs} name="inputs"
                onChange={e => setInputs(e.target.value)} disabled={!canEdit && questionId}/> */}
            {(!canEdit && questionId) ? null : (
                <span>
                    {isPublic ? "public " : "private "}
                    <button onClick={() => setIsPublic(!isPublic)}>toggle</button>
                    <br/>
                    <button onClick={questionId ? putQuestion : postQuestion}>
                        {questionId ? "Submit changes" : "Create question"}
                    </button>
                </span>
            )}
            {!questionId ? null :
                <>
                    {messages.map(err => <li key={err}>{err}</li>)}
                    <h4>Would you like to duplicate
                        {canEdit ? " or delete ": " "} this question?
                    </h4>
                    <span>
                        <button onClick={() => duplicateQuestion()}>Duplicate it</button>
                        {messages.map(err => <li key={err}>{err}</li>)}
                        {!canEdit ? null :
                            <button onClick={() => deleteQuestion()}>Delete it</button>
                        }
                    </span>
                </>
            }
        </>
    );
};

export default EditQuestion;
