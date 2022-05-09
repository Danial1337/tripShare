import React from "react";
import {useAuth} from "react-nhost";
import {Route, Redirect} from "react-router-dom";

type PrivateRouteProps = {
    component: React.FC;
    path: string;
    exact: boolean;
};

const PrivateRoute = ({component, path, exact}: PrivateRouteProps) => {
    const{ signedIn } = useAuth();

    return signedIn ? 
    <Route path={path} component={component} exact={exact}/> : 
    <Redirect to="/login"/> 
}

export default PrivateRoute;