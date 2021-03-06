import React from 'react';
import SubInput2 from './SubInput2';


const Input2 = ({ row, input, inputs, setInputs, canEdit, varNames, setVarNames }) => {
    return (
        <tbody>
            {input.map((subinput, subrow) => (
                <SubInput2
                    key={`${row}${subrow}`}
                    row={row}
                    subrow={subrow}
                    subinput={subinput}
                    inputs={inputs}
                    setInputs={setInputs}
                    canEdit={canEdit}
                    varNames={varNames}
                    setVarNames={setVarNames}
                />
            ))}
        </tbody>
    )
}

export default Input2;
