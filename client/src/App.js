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

const App = () => {
    const [fetchWithCSRF] = useState(() => fetch);
    const [currentUser, setCurrentUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true)
    const authContextValue = {
        fetchWithCSRF,
        currentUser,
        setCurrentUser,
        userType,
        setUserType
    };

    useEffect(() => {
        (async () => {
            const response = await fetch('/restore');
            const user = await response.json();
            setCurrentUser(user.current_user);
            setUserType(!user ? null : user.is_instructor ? "instructor" : "student")
            setLoading(false);
        })()
    }, [])

    return (
        <AuthContext.Provider value={authContextValue}>
            {loading ? <h1>Loading</h1> :
                <BrowserRouter>
                    <NavBar />
                    <div className="switch">
                        <Switch>
                            <AuthRoute exact path="/welcome" component={Welcome} />
                            <AuthRoute exact path="/welcomeInstructor" userType={"instructor"} component={Welcome} />
                            <AuthRoute exact path="/welcomeStudent" userType={"student"} component={Welcome} />
                            <AuthRoute exact path="/loginInstructor" defaultUser={"demoInstructor@aol.com"} component={LogIn} />
                            <AuthRoute exact path="/loginStudent" defaultUser={"demoStudent@aol.com"} component={LogIn} />
                            <AuthRoute exact path="/signupInstructor" isInstructor={true} component={SignUp} />
                            <AuthRoute exact path="/signupStudent" isInstructor={false} component={SignUp} />
                            <ProtectedRoute exact path="/logout" component={LogOut} />
                            <ProtectedRoute exact path="/editUser" component={EditUser} />
                            {/* all courses which student is enrolled in or instructor teaches */}
                            <ProtectedRoute exact path="/" component={Enrollments} />
                            {/* instructor: all questions available */}
                            <ProtectedInstructorRoute exact path="/questions" component={Questions} />
                            <Route exact path="/questions/:questionId" component={EditQuestion} />
                            {/* instructor: all assignments available */}
                            <ProtectedInstructorRoute exact path="/assignments" component={Assignments} />
                            <Route exact path="/assignments/:assignmentId" component={EditAssignment} />
                            <Route exact path="/courses/edit/:courseId" component={EditCourse} />
                            {/* all deployed assignments for a particular course*/}
                            <Route exact path="/courses/:courseId" component={Deployments} />
                            {/* all students enrolled in a particular course*/}
                            <Route exact path="/roster/:courseId" component={Roster} />
                            {/* all questions & responses for the user for a particular deployed assignment */}
                            <Route exact path="/submissions/:deploymentId" component={Submissions} />
                            {/* Enables instructor to change details of a particular deployment (needs deadline functionality) */}
                            <Route exact path="/deployments/:didAndAidAndCid" component={EditDeployment} />
                        </Switch>
                        <br/>
                        <span>
                            creator:
                            <a href="https://pknipp.github.io/" target="_blank" rel="noopener noreferrer">Peter Knipp</a>
                        </span>
                    </div>
                </BrowserRouter>
            }
        </AuthContext.Provider>
    );
}

export default App;
