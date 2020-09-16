import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  AssignmentInd,
  MonetizationOn,
  VideoLibrary, Stars,
  Work, SupervisedUserCircle
} from "@material-ui/icons";
import Dashboard from "pages/Dashboard";
import Jobs from "pages/Jobs";
import Revenue from "pages/Revenue";
import Profile from "pages/Profile";
import VideoTemplates from "pages/VideoTemplates";
import React from "react";
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import Navbar from "../components/Navbar";
import RoleBasedRoute from "components/RoleBasedRoute"
import Creators from "pages/Creators"
import Users from "pages/Users"
import ChangePassword from "./ChangePassword";

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
      allowedRoles: ['admin', 'creator', 'user']
    },
    {
      text: "Jobs",
      icon: <Work />,
      to: `${url}/jobs`,
      allowedRoles: ['admin', 'creator', 'user']

    },

    {
      text: "Profile and Settings",
      icon: <AssignmentInd />,
      to: `${url}/profile`,
      allowedRoles: ['admin', 'creator', 'user']
    },
    {
      text: "Revenue",
      icon: <MonetizationOn />,
      to: `${url}/revenue`,
      allowedRoles: ['admin', 'creator', 'user']

    },
    {
      text: "Creators",
      icon: <SupervisedUserCircle />,
      to: `${url}/creators`,
      allowedRoles: ['admin']
    },
    {
      text: "Users",
      icon: <Stars />,
      to: `${url}/users`,
      allowedRoles: ['admin']
    },
  ];

  return (
    <div className={classes.root}>
      <Navbar items={links} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route path={`${path}/`} exact component={ChangePassword} />
          <Route path={`${path}/profile`} component={Profile} />
          <Route path={`${path}/videoTemplates`} component={VideoTemplates} />
          <Route path={`${path}/revenue`} component={Revenue} />
          <Route path={`${path}/jobs`} component={Jobs} />
          <RoleBasedRoute allowedRoles={['admin']}>
            <Route path={`${path}/creators`} component={Creators} />
            <Route path={`${path}/users`} component={Users} />
          </RoleBasedRoute>
          <Redirect to={"/NotFound"} />
        </Switch>
      </main>
    </div >
  );
};
