import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import UsersTable from "pages/UsersTable";
import UserDetails from "pages/UserDetails";
import { Typography } from "@material-ui/core";

export default () => {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${path}/`} exact component={UsersTable} />
            <Route path={`${path}/:id`} component={UserDetails} />
        </Switch>
    );
};
