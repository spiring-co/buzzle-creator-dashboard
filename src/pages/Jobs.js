import React, { useEffect, useState } from "react";
import JobDetails from "./JobDetails";
import { Route, Switch, useRouteMatch, useHistory } from "react-router-dom";
import JobsTable from "./JobsTable";

export default () => {
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/`} exact component={JobsTable} />
      <Route path={`${path}/:jobId`} component={JobDetails} />
    </Switch>
  );
};
