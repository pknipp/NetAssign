import React, { useState, useContext, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
// import innerText from "react-innertext";
import AuthContext from '../auth';
import correct from "../correct10.jpg";
import incorrect from "../incorrect10.jpeg";

const Question = ({ author, question, answer, inputs }) => (
    <li>
        {author}{question}{answer}{inputs}
    </li>
)   
export default Question;
