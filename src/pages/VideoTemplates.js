import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import AddVideoTemplate from "pages/AddVideoTemplate";
import CreatorVideoTemplates from "pages/CreatorVideoTemplates";
import VideoTemplate from "pages/VideoTemplate";

export default () => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/`} exact component={CreatorVideoTemplates} />
      <Route path={`${path}/add`} component={AddVideoTemplate} />
      <Route path={`${path}/:uid/edit`} component={AddVideoTemplate} />
      <Route path={`${path}/:id`} component={VideoTemplate} />
    </Switch>
  );
};
