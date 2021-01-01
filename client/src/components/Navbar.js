import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ currentUserId, currentUser }) => (
    <>
        <NavLink to="/" activeClassName="active">MyWebAssign</NavLink>
        {currentUserId && currentUser &&
            <>
                <a href={`/${currentUser.user_name}`}>{currentUser.user_name}</a>
                <a href="/edituser">Account Details</a>
                <a href="/logout">Log Out</a>
            </>
        }
        {!currentUserId &&
            <>
                <a href="/login" >Log In</a>
                <a href="/signup">Sign Up</a>
            </>
        }
    </>
)
export default Navbar;
