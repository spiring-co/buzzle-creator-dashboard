import { MuiThemeProvider } from "@material-ui/core/styles";
import PrivateRoute from "components/PrivateRoute";
import { DarkModeProvider, useDarkMode } from "helpers/useDarkMode";
import ForgotPassword from "pages/ForgotPassword";
import Home from "pages/Home";
import Landing from "pages/Landing";
import Login from "pages/Login";
import NotFoundPage from "pages/NotFoundPage";
import Register from "pages/Register";
import AddVideoTemplateOutline from "pages/AddVideoTemplateOutline";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "services/auth";
import { darkTheme, lightTheme } from "helpers/themes";

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
            <Route path="/register" exact component={Register} />
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
