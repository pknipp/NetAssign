import React, { useEffect, useState } from 'react';

const InputControl = ({ canEdit, inputLength, setInputLength, inputs, setInputs, varNames, setVarNames }) => {

    return (
        <span>
            <button onClick={
                () => {
                let newInputLength = inputLength + 1;
                let j = 0;
                while (varNames.has("x" + j)) j++;
                let varName = "x" + j;
                let newInputs = [...JSON.parse(JSON.stringify(inputs)), [varName, 2, 3, 10]];
                varNames.add(varName);
                setVarNames(varNames);
                setInputLength(newInputLength)
                setInputs(newInputs);
            }}>
                increase
            </button>
            {!inputLength ? null : <button disabled={!canEdit} onClick={
                () => {
                let newInputLength = inputLength - 1;
                let newInputs = JSON.parse(JSON.stringify(inputs)).slice(0, -1);
                setInputLength(newInputLength)
                setInputs(newInputs);
            }}>
                decrease
            </button>}
            <> (from <>{inputLength}</>) the number of this type</>
        </span>
    )
};

export default InputControl;
