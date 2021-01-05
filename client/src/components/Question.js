import React, { useState } from 'react';

const handleSubmit = e => {
    e.preventDefault();
    console.log("submitted answer");
}


const Question = ({ question }) => {
    const [answer, setAnswer] = useState("");
    return <li key={question.id}>
        {question.question}<br/>
        <form onSubmit={handleSubmit}>
            <input
                type="number" placeholder="Answer" value={answer}
                onChange={e => setAnswer(Number(e.target.value))}
            />
        </form>
    </li>
}
export default Question;
