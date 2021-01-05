// import { createStyles, makeStyles } from "@material-ui/core/styles";
// import {
//   AssignmentInd,
//   MonetizationOn,
//   VideoLibrary,
//   Stars,
//   Work,
//   SupervisedUserCircle,
// } from "@material-ui/icons";
// import Dashboard from "pages/Dashboard";
// import Jobs from "pages/Jobs";
// import Revenue from "pages/Revenue";
// import Profile from "pages/Profile";
// import VideoTemplates from "pages/VideoTemplates";
// import React from "react";
// import StorageIcon from "@material-ui/icons/Storage";
// import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import RoleBasedRoute from "components/RoleBasedRoute";
// import Creators from "pages/Creators";
// import Users from "pages/Users";
// import ChangePassword from "./ChangePassword";
// import Servers from "./Servers";
// import Graphs from "../components/Graphs";

// // import { Chart } from "react-charts";

// const useStyles = makeStyles((theme) =>
//   createStyles({
//     root: {
//       display: "flex",
//     },

//     toolbar: {
//       display: "flex",
//       ...theme.mixins.toolbar,
//     },
//     content: {
//       flexGrow: 1,
//       padding: theme.spacing(3),
//     },
//   })
// );

// export default () => {
//   let { path, url } = useRouteMatch();
//   // const [jobIds, setJobIds] = useState([]);
//   const classes = useStyles();
//   const links = [
//     {
//       text: "Video Templates",
//       icon: <VideoLibrary />,
//       to: `${url}/videoTemplates`,
//       allowedRoles: ["Admin", "Creator", "User"],
//     },
//     {
//       text: "Jobs",
//       icon: <Work />,
//       to: `${url}/jobs`,
//       allowedRoles: ["Admin", "Creator", "User"],
//     },

//     {
//       text: "Profile and Settings",
//       icon: <AssignmentInd />,
//       to: `${url}/profile`,
//       allowedRoles: ["Admin", "Creator", "User"],
//     },
//     {
//       text: "Revenue",
//       icon: <MonetizationOn />,
//       to: `${url}/revenue`,
//       allowedRoles: ["Admin", "Creator", "User"],
//     },
//     {
//       text: "Creators",
//       icon: <SupervisedUserCircle />,
//       to: `${url}/creators`,
//       allowedRoles: ["Admin"],
//     },
//     {
//       text: "Users",
//       icon: <Stars />,
//       to: `${url}/users`,
//       allowedRoles: ["Admin"],
//     },
//     {
//       text: "Render Server",
//       icon: <StorageIcon />,
//       to: `${url}/servers`,
//       allowedRoles: ["Admin"],
//     },
//   ];

//   return (
//     <div className={classes.root}>
//       <Navbar items={links} />
//       <main className={classes.content}>
//         <div className={classes.toolbar} />
//         <Switch>
//           <Route path={`${path}/`} exact component={Dashboard} />
//           <Route path={`${path}/profile`} component={Profile} />
//           <Route path={`${path}/videoTemplates`} component={VideoTemplates} />
//           <Route path={`${path}/revenue`} component={Revenue} />
//           <Route path={`${path}/jobs`} component={Jobs} />
//           <RoleBasedRoute allowedRoles={["Admin"]}>
//             <Route path={`${path}/creators`} component={Creators} />
//             <Route path={`${path}/users`} component={Users} />
//             <Route path={`${path}/servers`} component={Servers} />
//           </RoleBasedRoute>
//           <Redirect to={"/NotFound"} />
//         </Switch>
//         <Graphs></Graphs>
//       </main>
//     </div>
//   );
// };
