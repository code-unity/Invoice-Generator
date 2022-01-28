import React from 'react';
import SideNav from './components/sideNav';
import {Route,Redirect} from 'react-router-dom'
function ProtectedRoute({component:Component,...rest}) {
    const signedin = localStorage.getItem('signedin');
    return (
        <Route
        {...rest}
        render ={(props)=>{
           
            if(signedin ){
                return (
                <div>
                    <SideNav/>
                    <Component/>
                </div>
                
                )
            }else{
                return (
                    <Redirect to ={{pathname: "/",state:{ from: props.location}}}/>
                );
                
            }
        }}
        />
    );
}

export default ProtectedRoute;