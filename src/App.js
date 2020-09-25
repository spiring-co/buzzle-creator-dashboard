import { MuiThemeProvider } from "@material-ui/core/styles";
import PrivateRoute from "components/PrivateRoute";
import { darkTheme, lightTheme } from "helpers/themes";
import { DarkModeProvider, useDarkMode } from "helpers/useDarkMode";
import AddVideoTemplateOutline from "pages/AddVideoTemplateOutline";
import AdminLogin from "pages/AdminLogin";
import ForgotPassword from "pages/ForgotPassword";
import Home from "pages/Home";
import Login from "pages/Login";
import NotFoundPage from "pages/NotFoundPage";
// import Landing from "pages/Landing";
import Register from "pages/Register";
import UserLogin from "pages/UserLogin";
import UserRegister from "pages/UserRegister";
import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
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
            <Route exact path="/" component={AddVideoTemplateOutline} />
            <Route path="/login" exact component={Login} />
            <Route path="/admin" exact component={AdminLogin} />
            <Route path="/user" exact component={UserLogin} />
            <Route path="/register" exact component={Register} />
            <Route path="/registerUser" exact component={UserRegister} />
            <Route path="/forgotPassword" component={ForgotPassword} />
            <PrivateRoute path="/home" component={Home} />
            <Route path="*" component={NotFoundPage} />
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
