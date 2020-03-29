import Dashboard from "pages/Dashboard";
import Orders from "pages/Orders";
import Profile from "pages/Profile";
import VideoTemplates from "pages/VideoTemplates";
import React from "react";
import { NavLink, Route, Switch, useRouteMatch } from "react-router-dom";

function Home() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <p> Hi, name here</p>
      <div>
        <br />
        <NavLink to={`${url}/profile`}>Your Profile and Settings</NavLink>
        <br />
        <NavLink to={`${url}/videoTemplates`}>Your Video Templates</NavLink>
        <br />
        <NavLink to={`${url}/orders`}>Your Orders</NavLink>
      </div>

      <Switch>
        <Route path={`${path}/`} exact component={Dashboard} />
        <Route path={`${path}/profile`} component={Profile} />
        <Route path={`${path}/videoTemplates`} component={VideoTemplates} />
        <Route path={`${path}/orders`} component={Orders} />
      </Switch>
    </div>
  );
}
export default Home;
