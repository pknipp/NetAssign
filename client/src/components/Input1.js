import React, { useState } from 'react';


const Input1 = ({ row, input, inputs, setInputs, canEdit }) => {
    const [varName, setVarName] = useState(input[0]);
    const [min, setMin] = useState(input[1]);
    const [max, setMax] = useState(input[2]);
    const [n, setN] = useState(input[3]);
    return (
        <>
        <td>
            <input type="text" value={varName} size={6} className="smaller"
                disabled={!canEdit} onChange={e => {
                    setVarName(e.target.value);
                    let myInputs = JSON.parse(JSON.stringify(inputs))
                    myInputs[row][0] = e.target.value || varName;
                    setInputs(myInputs);
                }}
            />
        </td>
        <td>
            <input type="number" value={min} className="smaller"
                disabled={!canEdit} onChange={e => {
                    setMin(e.target.value);
                    let myInputs = JSON.parse(JSON.stringify(inputs))
                    myInputs[row][1] = Number(e.target.value) || min;
                    setInputs(myInputs);
                }}
            />
        </td>
        <td>
            <input type="number" value={max} className="smaller"
                disabled={!canEdit} onChange={e => {
                    setMax(e.target.value);
                    let myInputs = JSON.parse(JSON.stringify(inputs))
                    myInputs[row][2] = Number(e.target.value) || max;
                    setInputs(myInputs);
                }}
            />
        </td>
        <td>
            <input type="number" value={n} min={1} max={1000} step={1}
                className="smaller" disabled={!canEdit} onChange={e => {
                    let newN = Math.max(1, Math.floor(Number(e.target.value)));
                    setN(newN);
                    let myInputs = JSON.parse(JSON.stringify(inputs))
                    myInputs[row][3] = newN || n;
                    setInputs(myInputs);
                }}
            />
        </td>
        </>
    )
}

export default Input1;
