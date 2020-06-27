import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import PrivateRoute from "components/PrivateRoute";

import Home from "pages/Home";
import Login from "pages/Login";
import Landing from "pages/Landing";
import Register from "pages/Register";
import ForgotPassword from "pages/ForgotPassword";
import NotFoundPage from "pages/NotFoundPage";
import { pink } from "@material-ui/core/colors";
import { AuthProvider } from "services/auth";
import { useDarkMode, DarkModeProvider } from "helpers/useDarkMode";

const AppChild = () => {
  const [theme, toggleTheme, componentMounted] = useDarkMode();
  if (!componentMounted) {
    return <div />;
  }
  const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#3742fa",
      },
      secondary: pink,
      background: {
        default: "#222",
        paper: "#333",
      },
    },
    typography: {
      fontSize: 14,
      fontFamily: "Noto Sans JP",
      fontWeightRegular: 500,
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
      MuiLink: {
        root: {
          fontWeight: 600,
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
      MuiTab: {
        wrapper: {
          fontWeight: 700,
          color: "white",
        },
      },
    },
  });

  const lightTheme = createMuiTheme({
    palette: {
      type: "light",
      primary: {
        main: "#3742fa",
      },
      secondary: pink,
    },
    typography: {
      fontSize: 14,
      fontFamily: "Noto Sans JP",
      fontWeightRegular: 500,
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
      MuiLink: {
        root: {
          fontWeight: 600,
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
      MuiTab: {
        wrapper: {
          fontWeight: 700,
          color: "#3742fa",
        },
      },
    },
  });
  const themeMode = theme == "light" ? lightTheme : darkTheme;
  return (
    <AuthProvider>
      <MuiThemeProvider theme={themeMode}>
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

export default () => {
  return (
    <DarkModeProvider>
      <AppChild />
    </DarkModeProvider>
  );
};
