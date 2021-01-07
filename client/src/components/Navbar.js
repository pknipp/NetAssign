import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = ({ currentUser }) => (
    <div className="navContainer">
        <span className="nav">
            <span>NetAssign welcomes</span>&nbsp;
            {(currentUser) ? currentUser.email : "you"}.
        </span>
        {(currentUser) ?
            <>
                {/* <span className="nav">{currentUser.email}</span> */}
                <NavLink exact to="/" className="nav" activeClassName="active">Home</NavLink>
                <NavLink to="/edituser" className="nav" activeClassName="active">Account Details</NavLink>
                <NavLink to="/logout" className="nav" activeClassName="active">Log Out</NavLink>
            </>
        :
            <>
                {/* <span className="nav">you</span> */}
                <NavLink to="/login" className="nav" activeClassName="active">Log In</NavLink>
                <NavLink to="/signup" className="nav" activeClassName="active">Sign Up</NavLink>
            </>
        }
    </div>
)
export default NavBar;
