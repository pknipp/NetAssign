import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from "../auth";

const NavBar = ({ userType }) => {
    const {currentUser } = useContext(AuthContext);
    return (
        <>
            <h1>
                NetAssign welcomes &nbsp;{(currentUser) ? currentUser.email : "you to the "}
                {userType === "instructor" ? "instructor " : "student "} side of NetAssign.
            </h1>
            {(currentUser) ?
                <>
                    {<>!(currentUser.is_instructor) ? null :
                        <NavLink exact to="/questions" className="nav" activeClassName="active">Questions</NavLink>
                        <NavLink exact to="/assignments" className="nav" activeClassName="active">Assignments</NavLink>
                    </>}
                    <NavLink exact to="/" className="nav" activeClassName="active">Home</NavLink>
                    <NavLink to="/edituser" className="nav" activeClassName="active">Account Details</NavLink>
                    <NavLink to="/logout" className="nav" activeClassName="active">Log Out</NavLink>
                </>
            :
                <>
                    {userType === "instructor" ?
                        <>
                        <NavLink to="/logininstructor" className="nav" activeClassName="active">Log In</NavLink>
                        <NavLink to="/signupinstructor" className="nav" activeClassName="active">Sign Up</NavLink>
                        </>
                    :
                        <>
                        <NavLink to="/loginstudent" className="nav" activeClassName="active">Log In</NavLink>
                        <NavLink to="/signupstudent" className="nav" activeClassName="active">Sign Up</NavLink>
                        </>
                    }
                </>
            }
        </>
    )
}
export default NavBar;
