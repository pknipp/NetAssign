import React, { useState } from 'react';


const Input2 = ({ row, subrow, input, inputs, setInputs, canEdit }) => {
    const [varName, setVarName] = useState(input[0]);
    const [list, setList] = useState(input.slice(1).join(','));
    return (
        <>
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
                <input type="text" value={list} className="larger"
                    disabled={!canEdit} onChange={e => {
                        setList(e.target.value);
                        let myInputs = JSON.parse(JSON.stringify(inputs))
                        myInputs[row][subrow] = [myInputs[row][subrow][0], ...e.target.value.split(",").map(elem => Number(elem))];
                        setInputs(myInputs);
                    }}
                />
            </td>
        </>
    )
}

export default Input2;
