import Dashboard from "pages/Dashboard";
import Orders from "pages/Orders";
import Profile from "pages/Profile";
import VideoTemplates from "pages/VideoTemplates";
import React from "react";
import { NavLink, Route, Switch, useRouteMatch } from "react-router-dom";

export default () => {
  let { path, url } = useRouteMatch();

  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
        <NavLink to={`${url}/profile`}>
          <h3 style={{ display: "inline" }}>Your Profile and Settings</h3>
        </NavLink>
        <NavLink to={`${url}/videoTemplates`}>
          <h3 style={{ display: "inline" }}>Your Video Templates</h3>
        </NavLink>
        <NavLink to={`${url}/orders`}>
          <h3 style={{ display: "inline" }}>Your Orders</h3>
        </NavLink>
      </div>
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
