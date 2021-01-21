import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from "../auth";

const NavBar = () => {
    const {currentUser } = useContext(AuthContext);
    return (
        <div className="navContainer">
            <span className="nav">
                <span>NetAssign welcomes</span>&nbsp;
                {(currentUser) ? currentUser.email : "you"}.
            </span>
            {(currentUser) ?
                <>
                    {(currentUser.is_instructor) ?
                        <>
                            <NavLink exact to="/questions" className="nav" activeClassName="active">
                                Questions
                            </NavLink>
                            <NavLink exact to="/assignments" className="nav" activeClassName="active">
                                Assignments
                            </NavLink>
                        </>
                    : null}
                    <NavLink exact to="/" className="nav" activeClassName="active">Home</NavLink>
                    <NavLink to="/edituser" className="nav" activeClassName="active">Account Details</NavLink>
                    <NavLink to="/logout" className="nav" activeClassName="active">Log Out</NavLink>
                </>
            :
                <>
                    <NavLink to="/logininstructor" className="nav" activeClassName="active">Log In (instructor)</NavLink>
                    <NavLink to="/loginstudent" className="nav" activeClassName="active">Log In (Student)</NavLink>
                    <NavLink to="/signupinstructor" className="nav" activeClassName="active">Sign Up (instructor)</NavLink>
                    <NavLink to="/signupstudent" className="nav" activeClassName="active">Sign Up (student)</NavLink>
                </>
            }
        </div>
    )
}
export default NavBar;
