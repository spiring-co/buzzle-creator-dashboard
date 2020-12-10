import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import CreatorsTable from "./CreatorsTable";
import CreatorDetails from "./CreatorDetails";

export default () => {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${path}/`} exact component={CreatorsTable} />
            <Route path={`${path}/:id`} component={CreatorDetails} />
        </Switch>
    );
};
