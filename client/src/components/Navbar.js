import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from "../auth";

const NavBar = () => {
    const { userType, currentUser } = useContext(AuthContext);
    const userTypes = ["instructor", "student"];
    const UserTypes = userTypes.map(userType => userType[0].toUpperCase() + userType.slice(1));
    const head = (
        <h1>
            Welcome {currentUser ? `${currentUser.email} ` : ""}
            to {!userType || currentUser ? "" : `the ${userType} side of`} NetAssign.
        </h1>
    );

    const noUserType = (
        <>
            {UserTypes.map((UserType, i) => (
                <NavLink key={i} exact to={`/welcome${UserType}`}>
                    {`${UserType}s`}
                </NavLink>
            ))}
        </>
    );

    const i = userTypes.indexOf(userType);
    const yesUserType = (
        <>
            <NavLink to={`/login${UserTypes[i]}`} className="nav" activeClassName="active">
                Log In
            </NavLink>
            <NavLink to={`signup${UserTypes[i]}`} className="nav" activeClassName="active">
                Sign Up
            </NavLink>
            <NavLink to={`/welcome${UserTypes[(i + 1) % 2]}`} className="nav">
                Switch to {`Switch to ${UserTypes[(i + 1) % 2]} Side`}
            </NavLink>
        </>
    )

    const instructor = currentUser && !currentUser.is_instructor ? null
    // Two links below are only visible to instructors
        :(
            <>
                <NavLink
                    exact to="/questions"
                    className="nav"
                    activeClassName="active"
                >
                    Questions
                </ NavLink>
                <NavLink
                    exact to="/assignments" className="nav"
                    activeClassName="active"
                >
                    Assignments
                </NavLink>
            </>
    );

    const user = (
        // Three links below are visible to all users: instructors and students
        <>
            {instructor}
                <NavLink
                    exact to="/"
                    className="nav"
                    activeClassName="active"
                >
                    Home
                </NavLink>
                <NavLink
                    to="/edituser"
                    className="nav" activeClassName="active">Account Details</  NavLink>
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
