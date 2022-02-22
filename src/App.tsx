import React, { useEffect, useMemo } from "react";
import { darkTheme, lightTheme } from "helpers/themes";
import { DarkModeProvider, useDarkMode } from "helpers/useDarkMode";
import PrivateRoute from "common/PrivateRoute";
// pages
// import AddVideoTemplateOutline from "pages/AddVideoTemplateOutline";
import Domains from "domains";
import NotFound from "domains/NotFound";

import Landing from "domains/Landing";
import TestJob from "domains/VideoTemplate/CreateTestJob";
import Auth from "domains/Auth";
import { SnackbarProvider, useSnackbar } from "notistack";
import { Route, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { AuthProvider, useAuth } from "services/auth";
import Page from "common/Page";
import { APIProvider } from "services/APIContext";
import { Box, CircularProgress, ThemeProvider } from "@material-ui/core";
import { ReAuthFlowProvider } from "services/Re-AuthContext";

const AppChild = () => {
  const [theme, componentMounted] = useDarkMode();
  const { isUserLoadingFromFirebase, user } = useAuth()
const appTheme=useMemo(() => theme == "light" ? lightTheme : darkTheme, [theme])
  if (!componentMounted || isUserLoadingFromFirebase) {
    return <Box style={{ height: '100%', margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress color="primary" />
    </Box>
  }
  return (
    <Box style={{ height: '100%', margin: 0 }}>
      <ThemeProvider theme={appTheme} >
        <Router>
          <Switch>
            <Route exact path="/"
              render={(props: any) => (
                <Page props={props} component={Landing} title="" />
              )} />
            <Route path="/login" exact
              render={(props: any) => (
                <Page props={props} component={Auth} title="Login" />
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
      </ThemeProvider >
    </Box >
  );
};

export default () => {
  return (
    <DarkModeProvider>
      <SnackbarProvider maxSnack={3} anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }
      }>
        <APIProvider>
          <AuthProvider>
            <ReAuthFlowProvider>
              <AppChild />
            </ReAuthFlowProvider>
          </AuthProvider>
        </APIProvider>
      </SnackbarProvider>
    </DarkModeProvider>
  );
};
