import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Page from "common/Page";

import CreatorsTable from "./CreatorsTable";
import CreatorDetails from "./CreatorDetails";

export default () => {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${path}/`} exact
                render={props => (
                    <Page props={props} component={CreatorsTable} title="Creators" />
                )}
            />
            <Route path={`${path}/:id`}
                render={props => (
                    <Page props={props} component={CreatorDetails} title="Creator details" />
                )}
            />
        </Switch>
    );
};
