import React, { useEffect } from "react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { MuiThemeProvider } from "@material-ui/core/styles";

import { darkTheme, lightTheme } from "helpers/themes";
import { DarkModeProvider, useDarkMode } from "helpers/useDarkMode";

import PrivateRoute from "common/PrivateRoute";
// pages
// import AddVideoTemplateOutline from "pages/AddVideoTemplateOutline";
import ForgotPassword from "domains/ForgotPassword";
import Domains from "domains";
import NotFound from "domains/NotFound";

import Landing from "domains/Landing";
import LandingDeveloper from "domains/LandingDeveloper";
import AdminLogin from "domains/Auth/AdminAuth/Login";
import TestJob from "domains/VideoTemplate/CreateTestJob";

import Register from "domains/Auth/CreatorAuth/Signup";
import Login from "domains/Auth/CreatorAuth/Login";

import UserLogin from "domains/Auth/UserAuth/Login";
import UserRegister from "domains/Auth/UserAuth/Signup";
import { SnackbarProvider, useSnackbar } from "notistack";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { AuthProvider } from "services/auth";
import Page from "common/Page";
import {  BillingProvider } from "services/billingContext";
const stripePromise = loadStripe('pk_test_51Ijgs0SIUtONOjVtNl3YLdtevghojdCG1P0MLSqIY9Ab4cgD1ULvGwnrdRQtqE4sylBi4FbBEtRYMchyrHgK0qVx00lsBY6hsf');
const AppChild = () => {
  const [theme, t, componentMounted] = useDarkMode();
  if (!componentMounted) {
    return <div />;
  }

  const themeMode = theme == "light" ? lightTheme : darkTheme;
  return (
    <AuthProvider>
      <MuiThemeProvider theme={themeMode}>
        <SnackbarProvider maxSnack={3} anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}>
          <Router>
            <Switch>
              <Route exact path="/"
                render={props => (
                  <Page props={props} component={Landing} title="Buzzle" />
                )} />
              <Route exact path="/developer"
                render={props => (
                  <Page props={props} component={LandingDeveloper} title="Buzzle" />
                )} />
              <Route path="/login" exact
                render={props => (
                  <Page props={props} component={Login} title="Buzzle | Creator Login" />
                )}
              />
              <Route path="/admin" exact
                render={props => (
                  <Page props={props} component={AdminLogin} title="Buzzle | Admin Login" />
                )} />
              <Route path="/user" exact
                render={props => (
                  <Page props={props} component={UserLogin} title="Buzzle | Developer Login" />
                )} />
              <Route path="/testJob" exact
                render={props => (
                  <Page props={props} component={TestJob} title="Buzzle | Test Job" />
                )}
              />
              <Route path="/register" exact
                render={props => (
                  <Page props={props} component={Register} title="Buzzle | Register" />
                )}
              />
              <Route path="/register/developer" exact
                render={props => (
                  <Page props={props} component={UserRegister} title="Buzzle | Register as Developer" />
                )} />
              <Route path="/forgotPassword"
                render={props => (
                  <Page props={props} component={ForgotPassword} title="Buzzle | Forgot password" />
                )} />
              <PrivateRoute path="/home"
                render={props => (
                  <Page props={props} component={Domains} title="Buzzle" />
                )}
              />
              <Route path="*"
                render={props => (
                  <Page props={props} component={NotFound} title="Buzzle | 404 - Not Found" />
                )}
              />
            </Switch>
          </Router>
        </SnackbarProvider>
      </MuiThemeProvider>
    </AuthProvider>
  );
};

export default () => {
  return (
    <DarkModeProvider>
      <Elements stripe={stripePromise}>
        <BillingProvider>
          <AppChild />
        </BillingProvider>
      </Elements>
    </DarkModeProvider>
  );
};
