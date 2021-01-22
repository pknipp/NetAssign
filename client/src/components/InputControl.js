import React, { useEffect, useState } from 'react';

const InputControl = ({ canEdit, inputLength, setInputLength, inputs, setInputs }) => {
    useEffect(() => (() => {
        console.log(inputLength)
        setInputLength(inputLength);
        setInputs(inputs)
    })(), [inputLength, inputs]);

    return (
        <span>
            <button onClick={
                () => {
                let newInputLength = inputLength + 1;
                let newInputs = [...JSON.parse(JSON.stringify(inputs)), [String.fromCharCode(96 + newInputLength), 2, 3, 10]];
                // let newInputs = [...JSON.parse(JSON.stringify(inputs)), [String.fromChar, 2, 3, 10]];
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
