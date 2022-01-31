import React from 'react';
import SideNav from './components/sideNav';
import CandidatePage from './components/candidatePage';
import { Route, Redirect } from 'react-router-dom'
function ProtectedRoute({ component: Component, ...rest }) {
    const signedin = localStorage.getItem('signedin');
    const role = localStorage.getItem('role');
    return (
        <Route
            {...rest}
            render={(props) => {

                if (signedin && role === 'admin') {
                    return (
                        <div>
                            <SideNav />
                            <Component />
                        </div>

                    )
                } else if (signedin && role === 'candidate') {
                    return (
                        <div>
                            <SideNav />
                            <CandidatePage />
                        </div>
                    )
                }
                else {
                    return (
                        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
                    );

                }
            }}
        />
    );
}

export default ProtectedRoute;