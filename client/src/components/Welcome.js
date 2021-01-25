import React, { useContext } from 'react';
import AuthContext from "../auth";

const Welcome = props => {
  const { userType, setUserType } = useContext(AuthContext);
  setUserType(props.userType);
  return (
    <div>
      {`info about ${!userType ? "general" : userType === "instructor" ? "instructor" : "student"} use of NA`}
    </div>
  );
}

export default Welcome;
