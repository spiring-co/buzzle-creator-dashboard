import Home from "pages/Home";
import Landing from "pages/Landing";
import Login from "pages/Login";
import Register from "pages/Register";
import React from "react";
import { AnimatedSwitch, AnimatedRoute } from "react-router-transition";
import { bounceTransition, mapStyles } from "../src/services/switchConfig";
import {
  Link,
  Redirect,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import useAuth from "services/auth";
import createOrder from "pages/createOrder";

function App() {
  const { logout, isAuthenticated } = useAuth();

  return (
    <div style={{ margin: "auto", width: "65%" }}>
      <Router>
        {isAuthenticated && (
          <button style={{ float: "right", display: "block" }} onClick={logout}>
            Logout
          </button>
        )}
        <h1>
          <img
            src={require("./assets/logo.png")}
            style={{ height: "2rem", margin: "0px 10px 10px 0px" }}
            alt="Pharaoh Logo"
          />
          <Link to="/home">Pharaoh</Link>
        </h1>
        <AnimatedSwitch
          atEnter={bounceTransition.atEnter}
          atLeave={bounceTransition.atLeave}
          atActive={bounceTransition.atActive}
          mapStyles={mapStyles}
          className="route-wrapper"
        >
          <AnimatedRoute
            atEnter={{ offset: -100 }}
            atLeave={{ offset: -100 }}
            atActive={{ offset: 0 }}
            mapStyles={(styles) => ({
              transform: `translateX(${styles.offset}%)`,
            })}
            exact
            path="/"
            component={Landing}
          />
          <AnimatedRoute
            atEnter={{ offset: -100 }}
            atLeave={{ offset: -100 }}
            atActive={{ offset: 0 }}
            mapStyles={(styles) => ({
              transform: `translateX(${styles.offset}%)`,
            })}
            path="/login"
            exact
            component={Login}
          />
          <AnimatedRoute
            atEnter={{ offset: -100 }}
            atLeave={{ offset: -100 }}
            atActive={{ offset: 0 }}
            mapStyles={(styles) => ({
              transform: `translateX(${styles.offset}%)`,
            })}
            path="/register"
            exact
            component={Register}
          />
          <AnimatedRoute
            atEnter={{ offset: -100 }}
            atLeave={{ offset: -100 }}
            atActive={{ offset: 0 }}
            mapStyles={(styles) => ({
              transform: `translateX(${styles.offset}%)`,
            })}
            path={`/createOrder/:videoTemplateId`}
            component={createOrder}
          />

          <PrivateRoute isAuthenticated={isAuthenticated}>
            <AnimatedRoute
              atEnter={{ offset: -100 }}
              atLeave={{ offset: -100 }}
              atActive={{ offset: 0 }}
              mapStyles={(styles) => ({
                transform: `translateX(${styles.offset}%)`,
              })}
              path="/home"
              component={Home}
            />
          </PrivateRoute>
        </AnimatedSwitch>
      </Router>
    </div>
  );
}

function PrivateRoute({ isAuthenticated, children, ...rest }) {
  return (
    <AnimatedRoute
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
export default App;
