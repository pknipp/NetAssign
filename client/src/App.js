import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import LogOut from './components/LogOut';
import EditUser from './components/EditUser';
import ProtectedInstructorRoute from "./components/ProtectedInstructorRoute";
import ProtectedRoute from "./components/ProtectedRoute"
import AuthRoute from "./components/AuthRoute";
import AuthContext from './auth';
import Enrollments from './components/Enrollments';
import Deployments from './components/Deployments';
import Submissions from './components/Submissions';
import Questions from './components/Questions';
import EditQuestion from './components/EditQuestion';
import Assignments from './components/Assignments';
import EditAssignment from './components/EditAssignment';
import EditDeployment from './components/EditDeployment';
import EditCourse from './components/EditCourse';
import Roster from './components/Roster';
import Welcome from './components/Welcome';
import WelcomeType from './components/WelcomeType';

const App = _ => {
    const [fetchWithCSRF] = useState(() => fetch);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true)
    const authContextValue = {
        fetchWithCSRF,
        currentUser,
        setCurrentUser
    };

    useEffect(() => {
        (async () => {
            const response = await fetch('/restore');
            const data = await response.json();
            setCurrentUser(data.current_user);
            setLoading(false);
        })()
    }, [])

    return (
        <AuthContext.Provider value={authContextValue}>
            {loading ? <h1>Loading</h1> :
                <BrowserRouter>
                    <div className="switch">
                        <Switch>
                            <AuthRoute exact path="/welcome" component={Welcome} />
                            {/* <AuthRoute exact path="/welcomeinstructor" userType={"instructor"} component={WelcomeType} /> */}
                            <AuthRoute exact path="/welcomeinstructor" userType={"instructor"} component={NavBar} />
                            <AuthRoute exact path="/welcomestudent" userType={"student"} component={NavBar} />
                            <AuthRoute exact path="/logininstructor" defaultUser={"demoInstructor@aol.com"} component={LogIn} />
                            <AuthRoute exact path="/loginstudent" defaultUser={"demoStudent@aol.com"} component={LogIn} />
                            <AuthRoute exact path="/signupInstructor" isInstructor={true} component={SignUp} />
                            <AuthRoute exact path="/signupStudent" isInstructor={false} component={SignUp} />
                            <ProtectedRoute exact path="/logout" component={LogOut} />
                            <ProtectedRoute exact path="/edituser" component={EditUser} />
                            <ProtectedRoute exact path="/" component={Enrollments} />
                            {/* instructor: all questions available */}
                            <ProtectedInstructorRoute exact path="/questions" component={Questions} />
                            <Route exact path="/questions/:questionId" component={EditQuestion} />
                            {/* instructor: all assignments available */}
                            <ProtectedInstructorRoute exact path="/assignments" component={Assignments} />
                            <Route exact path="/assignments/:assignmentId" component={EditAssignment} />
                            {/*  self-explanatory*/}
                            <Route exact path="/courses/edit/:courseId" component={EditCourse} />
                            {/* all DID's for a particular course*/}
                            <Route exact path="/courses/:courseId" component={Deployments} />
                            <Route exact path="/roster/:courseId" component={Roster} />
                            <Route exact path="/submissions/:deploymentId" component={Submissions} />
                            <Route exact path="/deployments/:deploymentId" component={EditDeployment} />
                        </Switch>
                    </div>
                </BrowserRouter>
            }
        </AuthContext.Provider>
    );
}

export default App;
