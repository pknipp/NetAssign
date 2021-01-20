import React, { useState } from 'react';


const Input = ({ row, input, inputs, setInputs }) => {
    const [varName, setVarName] = useState(input[0]);
    const [min, setMin] = useState(input[1]);
    const [max, setMax] = useState(input[2]);
    const [n, setN] = useState(input[3]);
    return (
        <>
        <td>
            <input type="text" value={varName} size={6}
                onChange={e => {
                    setVarName(e.target.value);
                    let myInputs = JSON.parse(JSON.stringify(inputs))
                    myInputs[row][0] = e.target.value;
                    setInputs(myInputs);
                }}
            />
        </td>
        <td>
            <input type="number" value={min} 
                onChange={e => {
                    setMin(e.target.value);
                    let myInputs = JSON.parse(JSON.stringify(inputs))
                    myInputs[row][1] = e.target.value;
                    setInputs(myInputs);
                }}
            />
        </td>
        <td>
            <input type="number" value={max}
                onChange={e => {
                    setMax(e.target.value);
                    let myInputs = JSON.parse(JSON.stringify(inputs))
                    myInputs[row][2] = e.target.value;
                    setInputs(myInputs);
                }}
            />
        </td>
        <td>
            <input type="number" value={n}
                onChange={e => {
                    setN(e.target.value);
                    let myInputs = JSON.parse(JSON.stringify(inputs))
                    myInputs[row][3] = e.target.value;
                    setInputs(myInputs);
                }}
            />
        </td>
        </>
    )
}

export default Input;
