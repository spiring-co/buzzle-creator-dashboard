import React, { useEffect } from "react";

import { MuiThemeProvider } from "@material-ui/core/styles";

import { darkTheme, lightTheme } from "helpers/themes";
import { DarkModeProvider, useDarkMode } from "helpers/useDarkMode";

import PrivateRoute from "common/PrivateRoute";
// pages
// import AddVideoTemplateOutline from "pages/AddVideoTemplateOutline";
import Domains from "domains";
import NotFound from "domains/NotFound";

import Landing from "domains/Landing";
import TestJob from "domains/VideoTemplate/CreateTestJob";
import LoginCumSignupCumForgot from "domains/Auth/LoginCumSignupCumForgot";
import { SnackbarProvider, useSnackbar } from "notistack";
import { Route, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { AuthProvider, useAuth } from "services/auth";
import Page from "common/Page";
import { APIProvider } from "services/APIContext";
import { Box, CircularProgress } from "@material-ui/core";

const AppChild = () => {
  const [theme, componentMounted] = useDarkMode();
  const { isUserLoadingFromFirebase, user } = useAuth()
  const themeMode = theme == "light" ? lightTheme : darkTheme;
  if (!componentMounted || isUserLoadingFromFirebase) {
    return <Box style={{ height: '100%', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress color="primary" />
    </Box>
  }
  return (
    <Box style={{ height: '100%', margin: 0 }}>
      <MuiThemeProvider theme={themeMode}>
        <SnackbarProvider maxSnack={3} anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }
        }>
          <Router>
            <Switch>
              <Route exact path="/"
                render={(props: any) => (
                  <Page props={props} component={Landing} title="" />
                )} />
              <Route path="/login" exact
                render={(props: any) => (
                  <Page props={props} component={LoginCumSignupCumForgot} title="Login" />
                )}
              />
              <Route path="/testJob" exact
                render={(props: any) => (
                  <Page props={props} component={TestJob} title="Test Job" />
                )}
              />
              <PrivateRoute path="/home"
                render={(props: any) => (
                  <Page props={props} component={Domains} title="Home" />
                )}
              />
              <Route path="*"
                render={(props: any) => (
                  <Page props={props} component={NotFound} title="404 - Not Found" />
                )}
              />
            </Switch>
          </Router>
        </SnackbarProvider >
      </MuiThemeProvider >
    </Box >
  );
};

export default () => {
  return (
    <DarkModeProvider>
      <APIProvider>
        <AuthProvider>
          <AppChild />
        </AuthProvider>
      </APIProvider>
    </DarkModeProvider>
  );
};
