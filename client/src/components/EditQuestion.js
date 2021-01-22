import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import AuthContext from '../auth';
import Input1 from './Input1';
import Input2 from './Input2';
import InputControl from './InputControl';


const EditQuestion = ({ match }) => {
    const questionId = Number(match.params.questionId)  ;
    const { fetchWithCSRF, currentUser } = useContext(AuthContext);
    const [questionCode, setQuestionCode] = useState('');
    const [question, setQuestion] = useState('');
    const [canEdit, setCanEdit] = useState(false);
    const [answerCode, setAnswerCode] = useState('');
    const [answer, setAnswer] = useState('');
    const [input1Length, setInput1Length] = useState(0);
    const [input2Length, setInput2Length] = useState(0);
    const [inputs1, setInputs1] = useState([]);
    const [inputs2, setInputs2] = useState([[]]);
    // const [inputLength, setInputLength] = useState(0);
    // const [inputs, setInputs] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (questionId > 0) {
        (async () => {
            try {
                const res = await fetch(`/api/questions/${questionId}`)
                const data = await res.json();
                if (!res.ok) {
                    setErrors(data.errors);
                } else {
                    setQuestionCode(data.question_code);
                    setAnswerCode(data.answer_code);
                    setInputs1(data.inputs.filter(input => typeof(input[0]) === "string"));
                    setInput1Length(data.inputs.filter(input => typeof(input[0]) === "string").length);
                    setInputs2(data.inputs.filter(input => typeof(input[0]) !== "string"));
                    setInput2Length(data.inputs.filter(input => typeof(input[0]) !== "string").length);
                    setIsPublic(data.is_public);
                    setQuestion(data.question);
                    setAnswer(data.answer);
                    setCanEdit(data.instructor_id === currentUser.id);
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
                body: JSON.stringify({ questionCode, answerCode, inputs: [...inputs1, ...inputs2], isPublic })
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
                body: JSON.stringify({ questionCode, answerCode, inputs: [...inputs1, ...inputs2], isPublic })
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
    return !currentUser.is_instructor ? <Redirect to="/login" /> : (
        <div className="qeditor">
            <span><h1>Question Editor</h1></span>
            <ul>{errors.map(err => <li key={err} className="error">{err}</li>)}</ul>
            <div className="qinputs">
                <div className="qinputs1">
                    <h2>Inputs chosen randomly from a number range</h2>
                    {!canEdit && questionId ? null :
                        <InputControl
                            canEdit={canEdit || !questionId}
                            inputLength={input1Length}
                            setInputLength={setInput1Length}
                            inputs={inputs1}
                            setInputs={setInputs1}
                        />}
                    {!input1Length ? null : <table>
                        <thead>
                            <tr>
                                 <th>variable</th>
                                 <th>min<br/> value</th>
                                 <th>max<br/> value</th>
                                 <th># of<br/> divisions</th>
                            </tr>
                        </thead>
                        <tbody>
                                {inputs1.map((input, row, inputs) => (
                                    <tr>
                                        <Input1
                                            key={row}
                                            row={row}
                                            input={input}
                                            inputs={inputs}
                                            setInputs={setInputs1}
                                            canEdit={canEdit || !questionId}
                                        />
                                    </tr>
                                ))}
                        </tbody>
                    </table>}
                </div>
                <div className="qinputs2">
                    <h2>Inputs chosen from arrays in correlated manners</h2>
                    {!canEdit && questionId ? null :
                        <InputControl
                        canEdit={canEdit || !questionId}
                        inputLength={input2Length}
                        setInputLength={setInput2Length}
                        inputs={inputs2}
                        setInputs={setInputs2}
                    />}
                    {!input2Length ? null : <table>
                        <thead>
                            <tr>
                                <th>set</th>
                                 <th>variable</th>
                                 <th> comma-separated list from which to pick values</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!(inputs2.length) ? null : (
                                inputs2.map((input, row, inputs) => (
                                    input.map((subinput, subrow) => (
                                        <tr>
                                            {subrow ? null : <td rowSpan={input.length} key={row}>{subrow + 1}</td>}
                                            <Input2
                                                key={`sub${subrow}`}
                                                row={row}
                                                subrow={subrow}
                                                input={subinput}
                                                inputs={inputs}
                                                setInputs={setInputs2}
                                                canEdit={canEdit || !questionId}
                                            />
                                        </tr>
                                    ))
                                ))
                            )}
                        </tbody>
                    </table>}
                </div>
            </div>
            <span>
                encoded question string:
                <textarea
                    placeholder="Question code" value={questionCode} rows="3" cols="50"
                    onChange={e => setQuestionCode(e.target.value)} disabled={!canEdit && questionId}
                />
            </span>
            <span>
                encoded answer string:
                <input
                    type="text" placeholder="Answer code" value={answerCode} className="larger"
                    onChange={e => setAnswerCode(e.target.value)} disabled={!canEdit && questionId}
                />
            </span>
            <span>
                randomized question: {question}
            </span>
            <span>
                corresponding answer: {answer}
                <br/> (Refresh browser in order to see other versions.)
            </span>
            {(!canEdit && questionId) ? null : (
                <span>
                    sharing: {isPublic ? "public " : "private "}
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
        </div>
    );
};

export default EditQuestion;
