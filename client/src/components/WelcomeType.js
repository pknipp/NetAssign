import React from 'react';
import { NavLink } from 'react-router-dom';

const WelcomeType = ({ userType }) => (
  <>
  <h4>Welcome {userType === "instructor" ? "instructor" : "student" }</h4>
  </>
);


export default WelcomeType;
