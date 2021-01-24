import React from 'react';
import { NavLink } from 'react-router-dom';

const Welcome = () => (
  <>
  <h1>Welcome to NetAssign, my clone of WebAssign</h1>
  <NavLink to="/welcomeinstructor">Instructor</NavLink>
  <NavLink to="/welcomestudent">Student</NavLink>
  </>
);


export default Welcome;
