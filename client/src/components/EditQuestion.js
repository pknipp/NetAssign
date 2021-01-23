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
    const [inputs2, setInputs2] = useState([]);
    const [varNames, setVarNames] = useState(new Set())
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
                    let inputs = data.inputs;
                    let inputs1 = [];
                    let inputs2 = [];
                    let varNames = new Set();
                    inputs.forEach(input => {
                        if (typeof(input[0]) === "string") {
                            inputs1.push(input);
                            varNames.add(input[0]);
                        } else {
                            inputs2.push(input);
                            input.forEach(subinput => {
                                varNames.add(subinput[0]);
                            });
                        }
                    })
                    setQuestionCode(data.question_code);
                    setAnswerCode(data.answer_code);
                    setInputs1(inputs1);
                    setInput1Length(inputs1.length);
                    setInputs2(inputs2);
                    setInput2Length(inputs2.length);
                    setVarNames(varNames);
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
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                if (responseData.messages) setMessages(responseData.messages)
                history.push("/questions")
            }
        })();
    }

    const postQuestion = () => {
        (async _ => {
            console.log(questionCode)
            const response = await fetchWithCSRF(`/api/questions`, {
                method: 'POST', headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ questionCode, answerCode, inputs: [...inputs1, ...inputs2], isPublic })
            });
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                if (responseData.messages) setMessages(responseData.messages)
                history.push("/questions")
            }
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
            <h2>Specifications of random inputs</h2>
            <ul>{errors.map(err => <li key={err} className="error">{err}</li>)}</ul>
            <div className="qinputs">
                <div className="qinputs1">
                    <h3>chosen from a number range</h3>
                    {!canEdit && questionId ? null :
                        <InputControl key="inputs1"
                            canEdit={canEdit || !questionId}
                            inputLength={input1Length}
                            setInputLength={setInput1Length}
                            inputs={inputs1}
                            setInputs={setInputs1}
                            varNames={varNames}
                            setVarNames={setVarNames}
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
                                            key={`${row}1`}
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
                    <h3>correlated choices from arrays</h3>
                    {!canEdit && questionId ? null :
                        <InputControl
                            key="inputs2"
                            canEdit={canEdit || !questionId}
                            inputLength={input2Length}
                            setInputLength={setInput2Length}
                            inputs={inputs2}
                            setInputs={setInputs2}
                            varNames={varNames}
                            setVarNames={setVarNames}
                            varArray={true}
                        />
                    }
                    {!input2Length ? null : <table>
                        <thead>
                            <tr>
                                <th></th>
                                 <th>variable</th>
                                 <th> comma-separated list from which to pick values</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!(inputs2.length) ? null : (
                                inputs2.map((input, row) => (
                                    <Input2
                                        key={`${row}2`}
                                        row={row}
                                        input={input}
                                        inputs={inputs2}
                                        setInputs={setInputs2}
                                        canEdit={canEdit || !questionId}
                                        varNames={varNames}
                                        setVarNames={setVarNames}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>}
                </div>
            </div>
            encoded question string:
            <textarea
                placeholder="Question code" value={questionCode} rows="3" cols="50"
                onChange={e => setQuestionCode(e.target.value)} disabled={!canEdit &&questionId}
            />
            encoded answer string:
            <input
                type="text" placeholder="Answer code" value={answerCode} className="larger"
                onChange={e => setAnswerCode(e.target.value)} disabled={!canEdit &&questionId}
            />
            <div>randomized question:</div>
            <div>{question}</div>
            <div>corresponding answer:</div>
            <div>{answer}</div>
            (Refresh browser in order to see other versions.)
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
