import React, { useState } from 'react';
import SubInput2 from './SubInput2';


const Input2 = ({ row, input, inputs, setInputs, canEdit, varNames, setVarNames }) => {
    const [varName, setVarName] = useState(input[0]);
    const [list, setList] = useState(input.slice(1).join(','));
    const [inputLength, setInputLength] = useState(input.length);
    return (
        input.map((subinput, subrow) => (
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
                // inputLength={inputLength}
                // setInputLength={setInputLength}
            />
        ))
    )
}

export default Input2;
