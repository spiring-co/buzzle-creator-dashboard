import Dashboard from "pages/Dashboard";
import Orders from "pages/Orders";
import Profile from "pages/Profile";
import VideoTemplates from "pages/VideoTemplates";
import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { AnimatedSwitch, AnimatedRoute } from "react-router-transition";
import { bounceTransition, mapStyles } from "../services/switchConfig";
import Form from "./createOrder";

export default () => {
  let { path, url } = useRouteMatch();

  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
        <NavLink to={`${url}/profile`}>
          <h3 style={{ display: "inline" }}>Your Profile and Settings</h3>
        </NavLink>
        <NavLink to={`${url}/videoTemplates`}>
          <h3 style={{ display: "inline" }}>Your Video Templates</h3>
        </NavLink>
        <NavLink to={`${url}/orders`}>
          <h3 style={{ display: "inline" }}>Your Orders</h3>
        </NavLink>
      </div>
      <AnimatedSwitch
        atEnter={bounceTransition.atEnter}
        atLeave={bounceTransition.atLeave}
        atActive={bounceTransition.atActive}
        mapStyles={mapStyles}
        className="route-wrapper"
      >
        <div style={{ flex: 3 }}>
          <AnimatedRoute
            atEnter={{ offset: -100 }}
            atLeave={{ offset: -100 }}
            atActive={{ offset: 0 }}
            mapStyles={(styles) => ({
              transform: `translateX(${styles.offset}%)`,
            })}
            path={`${path}/`}
            exact
            component={Dashboard}
          />
          <AnimatedRoute
            atEnter={{ offset: -100 }}
            atLeave={{ offset: -100 }}
            atActive={{ offset: 0 }}
            mapStyles={(styles) => ({
              transform: `translateX(${styles.offset}%)`,
            })}
            path={`${path}/profile`}
            component={Profile}
          />
          <AnimatedRoute
            atEnter={{ offset: -100 }}
            atLeave={{ offset: -100 }}
            atActive={{ offset: 0 }}
            mapStyles={(styles) => ({
              transform: `translateX(${styles.offset}%)`,
            })}
            path={`${path}/videoTemplates`}
            component={VideoTemplates}
          />
          <AnimatedRoute
            atEnter={{ offset: -100 }}
            atLeave={{ offset: -100 }}
            atActive={{ offset: 0 }}
            mapStyles={(styles) => ({
              transform: `translateX(${styles.offset}%)`,
            })}
            path={`${path}/orders`}
            component={Orders}
          />
        </div>
      </AnimatedSwitch>
    </div>
  );
};
