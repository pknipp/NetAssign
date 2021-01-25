import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from "../auth";

const NavBar = () => {
    const { userType, currentUser } = useContext(AuthContext);
    const head = (
        <h1>
            Welcome {(currentUser) ? `${currentUser.email} ` : ""}
            to {!userType || currentUser ? "" : `the ${userType === "instructor" ? "instructor" : "student"} side of`} NetAssign.
        </h1>
    );

    const noUserType = (
        <>
            <NavLink exact to="/welcomeInstructor">Instructors</NavLink>
            <NavLink exact to="/welcomeStudent">Students</NavLink>
        </>
    );

    const yesUserType = userType === "instructor" ? (
        <>
            <NavLink to="/loginInstructor" className="nav" activeClassName="active">
                Log In
            </NavLink>
            <NavLink to="/signupInstructor" className="nav" activeClassName="active">
                Sign Up
            </NavLink>
            <NavLink to="/welcomeStudent" className="nav">Switch to Student Side</NavLink>
        </>)
    :
        <>
            <NavLink to="/loginStudent" className="nav" activeClassName="active">
                Log In
            </NavLink>
            <NavLink to="/signupStudent" className="nav" activeClassName="active">
                Sign Up
            </NavLink>
            <NavLink to="/welcomeInstructor" className="nav">Switch to Instructor Side</NavLink>
        </>


    const instructor = currentUser && !currentUser.is_instructor ? null : (
        <>
            <NavLink exact to="/questions" className="nav" activeClassName="active">Questions</NavLink>
            <NavLink exact to="/assignments" className="nav" activeClassName="active">Assignments</NavLink>
        </>
    );

    const user = (
        <>
            {instructor}
            <NavLink exact to="/" className="nav" activeClassName="active">Home</NavLink>
            <NavLink to="/edituser" className="nav" activeClassName="active">Account Details</NavLink>
            <NavLink to="/logout" className="nav" activeClassName="active">Log Out</NavLink>
        </>
    );

    return (
        <div className="nav-container">
            {head}
            <div>
                {!userType ? noUserType : !currentUser ? yesUserType : user}
            </div>
        </div>
    )
}
export default NavBar;
