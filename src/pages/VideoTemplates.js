import AddVideoTemplate from "pages/AddVideoTemplate";
import CreatorVideoTemplates from "pages/CreatorVideoTemplates";
import VideoTemplate from "pages/VideoTemplate";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

export default () => {
  let { path } = useRouteMatch();

  return (
    <div>
      <br />
      <Switch>
        <Route path={`${path}/`} exact component={CreatorVideoTemplates} />
        <Route path={`${path}/add`} component={AddVideoTemplate} />
        <Route path={`${path}/:uid/edit`} component={AddVideoTemplate} />
        <Route path={`${path}/:uid`} component={VideoTemplate} />
      </Switch>
    </div>
  );
};
