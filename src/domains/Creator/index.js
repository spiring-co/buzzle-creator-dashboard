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
                    <Page {...props} component={CreatorsTable} title="Buzzle | Creators" />
                )}
            />
            <Route path={`${path}/:id`}
                render={props => (
                    <Page {...props} component={CreatorDetails} title="Buzzle | Creator details" />
                )}
            />
        </Switch>
    );
};
