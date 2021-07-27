import React from 'react';
import {Route,Redirect} from 'react-router-dom'
function ProtectedRoute({component:Component,...rest}) {
    const signedin = localStorage.getItem('signedin');
    return (
        <Route
        {...rest}
        render ={(props)=>{
            console.log("rest",rest);
            console.log("signed",signedin);
            if(signedin ){
                return <Component/>;
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