import React from "react";
import info from "../info.png";
import cancel from "../cancel.jpeg";
const ToggleInfo = ({ onClick, name, toggle }) => {
    return (
    <button
        className="info"
        onClick={onClick}
        name={name}
    >
        <img
            src={`${toggle ? cancel : info}`}
            alt={`Do ${toggle ? "not" : ""} display info about this control.`} />
    </button>
)}
export default ToggleInfo;
