import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
    AssignmentInd,
    MonetizationOn,
    VideoLibrary,
    Stars,
    Work,
    SupervisedUserCircle,
} from "@material-ui/icons";


import StorageIcon from "@material-ui/icons/Storage";
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import Navbar from "common/Navbar";
import RoleBasedRoute from "common/RoleBasedRoute";
import Revenue from "domains/Revenue";
import Home from "domains/Home";
import Profile from "domains/Profile";
import Users from "domains/User";
import Servers from "domains/Servers";
import Creators from "domains/Creator";
import VideoTemplates from "domains/VideoTemplate";
import Jobs from "domains/Job";
import Page from "common/Page";

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
            allowedRoles: ["Admin", "Creator", "Developer"],
        },
        {
            text: "Jobs",
            icon: <Work />,
            to: `${url}/jobs`,
            allowedRoles: ["Admin", "Creator", "Developer"],
        },

        {
            text: "Profile and Settings",
            icon: <AssignmentInd />,
            to: `${url}/profile`,
            allowedRoles: ["Admin", "Creator", "Developer"],
        },
        {
            text: "Revenue",
            icon: <MonetizationOn />,
            to: `${url}/revenue`,
            allowedRoles: ["Admin", "Creator", "Developer"],
        },
        {
            text: "Creators",
            icon: <SupervisedUserCircle />,
            to: `${url}/creators`,
            allowedRoles: ["Admin"],
        },
        {
            text: "Users",
            icon: <Stars />,
            to: `${url}/users`,
            allowedRoles: ["Admin"],
        },
        {
            text: "Render Server",
            icon: <StorageIcon />,
            to: `${url}/servers`,
            allowedRoles: ["Admin"],
        },
    ];

    return (
        <div className={classes.root}>
            <Navbar items={links} />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Switch>
                    <Route path={`${path}/`} exact
                        render={props => (
                            <Page props={props} component={Home} title="Buzzle" />
                        )}
                    />
                    <Route path={`${path}/profile`}
                        render={props => (
                            <Page props={props} component={Profile} title="Buzzle | Profile" />
                        )} />
                    <Route path={`${path}/videoTemplates`}
                        render={props => (
                            <Page props={props} component={VideoTemplates} title="Buzzle | Video Templates" />
                        )}
                    />
                    <Route path={`${path}/revenue`}
                        render={props => (
                            <Page props={props} component={Revenue} title="Buzzle | Revenue" />
                        )} />
                    <Route path={`${path}/jobs`}
                        render={props => (
                            <Page props={props} component={Jobs} title="Buzzle | Jobs" />
                        )} />
                    <RoleBasedRoute allowedRoles={["Admin"]}>
                        <Route path={`${path}/creators`}
                            render={props => (
                                <Page props={props} component={Creators} title="Buzzle | Creators" />
                            )} />
                        <Route path={`${path}/users`}
                            render={props => (
                                <Page props={props} component={Users} title="Buzzle | Developers" />
                            )} />
                        <Route path={`${path}/servers`}
                            render={props => (
                                <Page props={props} component={Servers} title="Buzzle | Servers" />
                            )}
                        />
                    </RoleBasedRoute>
                    <Redirect to={"/NotFound"} />
                </Switch>
            </main>
        </div>
    );
};
