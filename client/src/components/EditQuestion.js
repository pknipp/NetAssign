import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import AuthContext from '../auth';
import Input1 from './Input1';
import Input2 from './Input2';
import InputControl from './InputControl';
import ToggleInfo from './ToggleInfo';


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
    const [isPublic, setIsPublic] = useState(true);
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);
    const [showInfo, setShowInfo] = useState({});
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

    const handleToggle = e => {
        let name = e.currentTarget.name;
        let newShowInfo = {...showInfo};
        newShowInfo[name] = !showInfo[name];
        setShowInfo(newShowInfo);
    }

    let text = {
        randomization: "NetAssign allows for two types of variable randomization: (1) a single variable assuming values which are uniformly spread in a particular interval, and (2) one or (more often) more variables which are chosen from the same number of lists, in a correlated manner.  The name for each variable may consist of one or more characters, each of which may be either a letter (upper or lower case), digit, or underscore (_).  The first character may not be a number.  Note that a single question can use both types of randomization.  Click below for more information about each type.",
        type1: "Click 'increase/decrease' to set the number of variables of this type that you want.  For each variable, choose its name and specify the minimum and maximum values that it may have. Last, specify the number of different values (minus 1) that it may possibly have.",
        type2: "First, decide how many groups of variables you want to choose in a correlated manner, and click the 'increase' buttons to generate rows for these.  Within each group, click the 'inc' button to generate the variables (usually two) the you need for that particular group.  After choosing the name for each variable, type the list of values for each variable, separated by commas.  Each list should solely of either numbers, booleans (expressed as either T/F, true/false, or True/False), or character strings.  To allow the values to be chosen in a correlated manner, the length of each list (in a group) should be the same.",
        questionCode: "This should consist of the text of your question but with variable values replaced by '{variableName}', ie the name of the variable surrounded by braces. For example for a question which requires the sum of two numbers, this would be 'What is the sum of {x1} and {x2}?', although you may use different variable names.",
        answerCode: `For a fill-in-the-blank question (including true-false), this should contain only one item: the name of the variable which represents the answer.  For a numerical-type question, this should contain a (perhaps) simple arithmetic expression which utilizes the names of your variables (not enclosed with braces) and operators such as +, -, *, /, and ^ (for exponentiation).  For a complete list of these operations, see http://www.partow.net/programming/exprtk or click the link above.`,
    }

    return !currentUser.is_instructor ? <Redirect to="/login" /> : (
        <div className="qeditor">
            <span><h1>Question Editor</h1></span>
            <span>
                <h2>Specifications of random inputs
                <ToggleInfo onClick={handleToggle} name="randomization" toggle={showInfo.randomization} />
                </h2>
            </span>
            <div>
                <i>{showInfo.randomization ? text.randomization : null}</i>
            </div>
            <ul>{errors.map(err => <li key={err} className="error">{err}</li>)}</ul>
            <div className="qinputs">
                <div className="qinputs1">
                    <h3>
                        1) chosen from a number range
                        <ToggleInfo onClick={handleToggle} name="type1" toggle={showInfo.type1} />
                    </h3>
                    <div>
                        <i>{showInfo.type1 ? text.type1 : null}</i>
                    </div>
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
                    <h3>
                        2) correlated choices from arrays
                        <ToggleInfo onClick={handleToggle} name="type2" toggle={showInfo.type2} />
                    </h3>
                    <div>
                        <i>{showInfo.type2 ? text.type2 : null}</i>
                    </div>

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
            <h4>
                question code:
                <ToggleInfo onClick={handleToggle} name="questionCode" toggle={showInfo.questionCode} />
            </h4>
            <div>
                <i>{showInfo.questionCode ? text.questionCode : null}</i>
            </div>
            <textarea
                placeholder="Question code" value={questionCode} rows="3" cols="50"
                onChange={e => setQuestionCode(e.target.value)} disabled={!canEdit &&questionId}
            />
            <h4>
                {!showInfo.answerCode ?
                    "answer code:"
                :
                    <a target="_blank" href="http://www.partow.net/programming/exprtk">
                        answer code:
                    </a>
                }
                <ToggleInfo onClick={handleToggle} name="answerCode" toggle={showInfo.answerCode} />
            </h4>
            <div>
                <i>{showInfo.answerCode ? text.answerCode : null}</i>
            </div>
            <input
                type="text" placeholder="Answer code" value={answerCode} className="larger"
                onChange={e => setAnswerCode(e.target.value)} disabled={!canEdit &&questionId}
            />
            <h4>randomized version:</h4>

            <div>Question: "<i>{question}</i>"   Answer: "<i>{answer}</i>"</div>
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
