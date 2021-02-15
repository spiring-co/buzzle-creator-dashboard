import React, { useEffect } from "react";

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
import AdminLogin from "domains/Auth/AdminAuth/Login";
import TestJob from "domains/VideoTemplate/CreateTestJob";

import Register from "domains/Auth/CreatorAuth/Signup";
import Login from "domains/Auth/CreatorAuth/Login";

import UserLogin from "domains/Auth/UserAuth/Login";
import UserRegister from "domains/Auth/UserAuth/Signup";
import { SnackbarProvider, useSnackbar } from "notistack";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { AuthProvider } from "services/auth";
import { messaging } from "services/firebase";

const AppChild = () => {
  const [theme, t, componentMounted] = useDarkMode();
  if (!componentMounted) {
    return <div />;
  }

  const themeMode = theme == "light" ? lightTheme : darkTheme;
  return (
    <AuthProvider>
      <MuiThemeProvider theme={themeMode}>
        <SnackbarProvider maxSnack={3}>
          <Router>
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route path="/login" exact component={Login} />
              <Route path="/admin" exact component={AdminLogin} />
              <Route path="/user" exact component={UserLogin} />
              <Route path="/testJob" exact component={TestJob} />
              <Route path="/register" exact component={Register} />
              <Route path="/registerUser" exact component={UserRegister} />
              <Route path="/forgotPassword" component={ForgotPassword} />
              <PrivateRoute path="/home" component={Domains} />
              <Route path="*" component={NotFound} />
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
      <AppChild />
    </DarkModeProvider>
  );
};
