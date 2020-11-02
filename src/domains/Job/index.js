import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import JobDetails from "./JobDetails";
import JobsTable from "./JobsTable";

export default () => {
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/`} exact component={JobsTable} />
      <Route path={`${path}/:id`} component={JobDetails} />
    </Switch>
  );
};
