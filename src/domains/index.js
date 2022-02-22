import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
    AssignmentInd,
    VideoLibrary,
    Stars,
    Work,
    Settings,
} from "@material-ui/icons";

import EqualizerIcon from '@material-ui/icons/Equalizer';
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import Navbar from "common/Navbar";
import RoleBasedRoute from "common/RoleBasedRoute";
import Revenue from "domains/Revenue";
import Home from "domains/Home";
import Setting from "domains/Setting";
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
            text: "Analytics",
            icon: <EqualizerIcon />,
            to: `${url}`,
            allowedRoles: "*",
        },
        {
            text: "Video Templates",
            icon: <VideoLibrary />,
            to: `${url}/videoTemplates`,
            allowedRoles: "*",
        },
        {
            text: "Jobs",
            icon: <Work />,
            to: `${url}/jobs`,
            allowedRoles: "*",
        },

        {
            text: "Settings",
            icon: <Settings />,
            to: `${url}/settings`,
            allowedRoles: "*",
        },
        // {
        //     text: "Revenue",
        //     icon: <MonetizationOn />,
        //     to: `${url}/revenue`,
        //     allowedRoles: "*",
        // },
        {
            text: "Users",
            icon: <Stars />,
            to: `${url}/users`,
            allowedRoles: ["Admin"],
        },
        // {
        //     text: "Render Server",
        //     icon: <StorageIcon />,
        //     to: `${url}/servers`,
        //     allowedRoles: ["Admin"],
        // },
    ];

    return (
        <div className={classes.root}>
            <Navbar items={links} />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Switch>
                    <Route path={`${path}/`} exact
                        render={props => (
                            <Page props={props} component={Home} title="" />
                        )}
                    />
                    <RoleBasedRoute path={`${path}/settings`}
                        allowedRoles={"*"}
                        render={props => (
                            <Page props={props} component={Setting} title="Settings" />
                        )} />
                    <RoleBasedRoute path={`${path}/videoTemplates`}
                        allowedRoles={"*"}
                        render={props => (
                            <Page props={props} component={VideoTemplates} title="Video Templates" />
                        )}
                    />
                    {/* <Route path={`${path}/revenue`}
                        render={props => (
                            <Page props={props} component={Revenue} title="Revenue" />
                        )} /> */}
                    <RoleBasedRoute path={`${path}/jobs`}
                        allowedRoles={"*"}
                        render={props => (
                            <Page props={props} component={Jobs} title="Jobs" />
                        )} />
                    <RoleBasedRoute path={`${path}/users`}
                        allowedRoles={["Admin"]}
                        render={props => (
                            <Page props={props} component={Users} title="Users" />
                        )} />
                    {/* <Route path={`${path}/servers`}
                        render={props => (
                            <Page props={props} component={Servers} title="Servers" />
                        )}
                    /> */}
                    <Redirect to={"/NotFound"} />
                </Switch>
            </main>
        </div >
    );
};
