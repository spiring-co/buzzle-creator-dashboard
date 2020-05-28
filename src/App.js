import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import PrivateRoute from "components/PrivateRoute";

import Home from "pages/Home";
import Login from "pages/Login";
import Landing from "pages/Landing";
import Register from "pages/Register";
import ForgotPassword from "pages/ForgotPassword";

const theme = createMuiTheme({});

export default () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/forgotPassword" component={ForgotPassword} />

          <PrivateRoute>
            <Route path="/home" component={Home} />
          </PrivateRoute>
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
};
