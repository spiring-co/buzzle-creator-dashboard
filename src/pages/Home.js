import Dashboard from "pages/Dashboard";
import Orders from "pages/Orders";
import Profile from "pages/Profile";
import VideoTemplates from "pages/VideoTemplates";
import React from "react";
import { NavLink, Route, Switch, useRouteMatch } from "react-router-dom";

import SideBar from "../components/SideBar";

export default () => {
  let { path, url } = useRouteMatch();

  return (

    <div>
      <SideBar Url={url} />

      <Switch>
        <div style={{ flex: 3 }}>
          <Route path={`${path}/`} exact component={Dashboard} />
          <Route path={`${path}/profile`} component={Profile} />
          <Route path={`${path}/videoTemplates`} component={VideoTemplates} />
          <Route path={`${path}/orders`} component={Orders} />
        </div>
      </Switch>
    </div>
  );
};
