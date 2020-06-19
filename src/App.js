import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import PrivateRoute from "components/PrivateRoute";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Home from "pages/Home";
import Login from "pages/Login";
import Landing from "pages/Landing";
import Register from "pages/Register";
import ForgotPassword from "pages/ForgotPassword";
import NotFoundPage from "pages/NotFoundPage";
import { pink } from "@material-ui/core/colors";
import { AuthProvider } from "services/auth";

export default () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#3742fa",
          },
          secondary: pink,
          background: {
            default: "#f1f2f6",
          },
        },
        typography: {
          fontSize: 14,
          fontFamily: "Noto Sans JP",
          h3: {
            fontWeight: 700,
          },
          h4: {
            fontWeight: 700,
          },
          h5: {
            fontWeight: 700,
          },
          h6: {
            fontWeight: 700,
          },
        },
        overrides: {
          MuiListItemText: {
            primary: {
              fontSize: 15,
              fontWeight: 700,
            },
          },
          MuiStepLabel: {
            label: {
              fontWeight: 700,
            },
            active: {
              fontWeight: 700,
            },
          },
          MuiButton: {
            label: {
              fontWeight: 700,
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <AuthProvider>
      <MuiThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/" component={Landing} />
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
