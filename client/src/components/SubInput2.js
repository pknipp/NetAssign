import React, { useState } from 'react';


const SubInput2 = ({ row, subrow, subinput, inputs, setInputs, canEdit, varNames, setVarNames }) => {
    const [varName, setVarName] = useState(subinput[0]);
    const [list, setList] = useState(subinput.slice(1).join(','));
    const [inputLength, setInputLength] = useState(inputs[row].length);
    return (
        <tr>
            {subrow ? null : <td rowSpan={inputs[row].length}>
                <button onClick={
                    () => {
                    let newInputLength = inputLength + 1;
                    let j = 0;
                    while (varNames.has("x" + j)) j++;
                    let varName = "x" + j;
                    let addedArray = [varName, ...new Array(inputs[row][subrow].length - 1).fill(0)];
                    let newInputs = JSON.parse(JSON.stringify(inputs));
                    newInputs[row] = [...newInputs[row], addedArray];
                    varNames.add(varName);
                    setVarNames(varNames);
                    setInputLength(newInputLength)
                    setInputs(newInputs);
                }}>
                     increment
                </button>
                {(inputs[row].length === 1) ? null : <button onClick={
                    () => {
                    let newInputLength = inputLength - 1;
                    let newInputs = JSON.parse(JSON.stringify(inputs));
                    varNames.delete(newInputs[row][newInputs[row].length - 1][0]);
                    newInputs[row] = newInputs[row].slice(0, -1);
                    setVarNames(varNames);
                    setInputLength(newInputLength)
                    setInputs(newInputs);
                }}>
                     decrement
                </button>}
                (from {inputs[row].length}) the number in this group
            </td>}
            <td>
                <input type="text" value={varName} size={6} className="smaller"
                    disabled={!canEdit} onChange={e => {
                        setVarName(e.target.value);
                        let myInputs = JSON.parse(JSON.stringify(inputs))
                        myInputs[row][subrow][0] = e.target.value || varName;
                        setInputs(myInputs);
                    }}
                />
            </td>
            <td>
                {/* <input type="text" value={list} className="larger"
                    disabled={!canEdit} onChange={e => {
                        setList(e.target.value);
                        let newInputs = JSON.parse(JSON.stringify(inputs))
                        newInputs[row][subrow] = [newInputs[row][subrow][0], ...e.target.value.split(",")];
                        // .map(elem => Number(elem))];
                        setInputs(newInputs);
                    }}
                /> */}
                <textarea value={list} className="larger"
                    disabled={!canEdit} onChange={e => {
                        setList(e.target.value);
                        let newInputs = JSON.parse(JSON.stringify(inputs))
                        newInputs[row][subrow] = [newInputs[row][subrow][0], ...e.target.value.split(",")];
                        // .map(elem => Number(elem))];
                        setInputs(newInputs);
                    }}
                />
            </td>
        </tr>
    )
}

export default SubInput2;
