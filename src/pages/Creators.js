import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import CreatorsTable from "pages/CreatorsTable";
import CreatorDetails from "pages/CreatorDetails";

export default () => {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${path}/`} exact component={CreatorsTable} />
            <Route path={`${path}/:id`} component={CreatorDetails} />
        </Switch>
    );
};
