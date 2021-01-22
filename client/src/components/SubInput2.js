import React, { useState } from 'react';


const SubInput2 = ({ row, subrow, input, inputs, setInputs, canEdit }) => {
    const [varName, setVarName] = useState(input[0]);
    const [list, setList] = useState(input.slice(1).join(','));
    return (
        <tr>
            {subrow ? null : <td rowSpan={inputs[row].length}>{inputs[row].length}</td>}
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
                <input className="larger" />
            </td>
        </tr>
    )
}

export default SubInput2;
