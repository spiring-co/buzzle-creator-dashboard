import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import UsersTable from "./UserTable";
import UserDetails from "./UserDetails";
import { Typography } from "@material-ui/core";
import Page from "common/Page";

export default () => {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${path}/`} exact
                render={props => (
                    <Page props={props} component={UsersTable} title="Developers" />
                )} />
            <Route path={`${path}/:id`} render={props => (
                <Page props={props} component={UserDetails} title="Developer Details" />
            )} />
        </Switch>
    );
};
