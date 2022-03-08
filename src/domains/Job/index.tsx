import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import JobDetails from "./JobDetails";
import JobsTable from "./JobsTable";
import Page from "common/Page";

export default () => {
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/`} exact
        render={props => (
          <Page props={props} component={JobsTable} title="Jobs" />
        )} />
      <Route path={`${path}/:id`}
        render={props => (
          <Page props={props} component={JobDetails} title="Job details" />
        )}
      />
    </Switch>
  );
};
