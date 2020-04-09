import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "components/Navbar";
import PrivateRoute from "components/PrivateRoute";
import Home from "pages/Home";
import Landing from "pages/Landing";
import Login from "pages/Login";
import Register from "pages/Register";
import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import useAuth from "services/auth";

export default () => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} logout={logout} />
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />

          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Route path="/home" component={Home} />
          </PrivateRoute>
        </Switch>
      </Router>
    </div>
  );
};
