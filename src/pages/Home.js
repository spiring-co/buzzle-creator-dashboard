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
      text: "Video Templates",
      icon: <VideoLibrary />,
      to: `${url}/videoTemplates`,
    },
    {
      text: "Jobs",
      icon: <Work />,
      to: `${url}/jobs`,
    },

    {
      text: "Profile and Settings",
      icon: <AssignmentInd />,
      to: `${url}/profile`,
    },
    {
      text: "Revenue",
      icon: <MonetizationOn />,
      to: `${url}/orders`,
    },
  ];

  return (
    <div className={classes.root}>
      <Navbar items={links} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route path={`${path}/`} exact component={Dashboard} />
          <Route path={`${path}/profile`} component={Profile} />
          <Route path={`${path}/videoTemplates`} component={VideoTemplates} />
          <Route path={`${path}/orders`} component={Orders} />
          <Route path={`${path}/jobs`} component={Jobs} />
        </Switch>
      </main>
    </div>
  );
};
