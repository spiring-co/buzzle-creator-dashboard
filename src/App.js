import React from "react";

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

import Register from "domains/Auth/CreatorAuth/Signup";
import Login from "domains/Auth/CreatorAuth/Login";

import UserLogin from "domains/Auth/UserAuth/Login";
import UserRegister from "domains/Auth/UserAuth/Signup";


import {
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import { AuthProvider } from "services/auth";

const AppChild = () => {
  const [theme, t, componentMounted] = useDarkMode();
  if (!componentMounted) {
    return <div />;
  }

  const themeMode = theme == "light" ? lightTheme : darkTheme;
  return (
    <AuthProvider>
      <MuiThemeProvider theme={themeMode}>
        <Router>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/login" exact component={Login} />
            <Route path="/admin" exact component={AdminLogin} />
            <Route path="/user" exact component={UserLogin} />

            <Route path="/register" exact component={Register} />
            <Route path="/registerUser" exact component={UserRegister} />

            <Route path="/forgotPassword" component={ForgotPassword} />

            <PrivateRoute path="/home" component={Domains} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Router>
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
