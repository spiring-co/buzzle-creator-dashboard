import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  AssignmentInd,
  MonetizationOn,
  VideoLibrary,
  Work,
} from "@material-ui/icons";
import Dashboard from "pages/Dashboard";
import Jobs from "pages/Jobs";
import Orders from "pages/Orders";
import Profile from "pages/Profile";
import VideoTemplates from "pages/VideoTemplates";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import Navbar from "../components/Navbar";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
    },

    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

export default () => {
  let { path, url } = useRouteMatch();
  const classes = useStyles();
  const links = [
    {
      text: "Profile and Settings",
      icon: <AssignmentInd />,
      to: `${url}/profile`,
    },
    {
      text: "Video Templates",
      icon: <VideoLibrary />,
      to: `${url}/videoTemplates`,
    },
    {
      text: "Orders",
      icon: <MonetizationOn />,
      to: `${url}/orders`,
    },
    {
      text: "Jobs",
      icon: <Work />,
      to: `${url}/jobs`,
    },
  ];
  return (
    <div className={classes.root}>
      <Navbar items={links} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route path={`${path}/`} exact>
            <Dashboard />
          </Route>

          <Route path={`${path}/profile`}>
            <Profile />
          </Route>
          <Route path={`${path}/videoTemplates`}>
            <VideoTemplates />
          </Route>
          <Route path={`${path}/orders`}>
            <Orders />
          </Route>
          <Route path={`${path}/jobs`}>
            <Jobs />
          </Route>
        </Switch>
      </main>
    </div>
  );
};
