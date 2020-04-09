import React from "react";
import { Redirect, Route } from "react-router-dom";

export default ({ isAuthenticated, children, ...rest }) => (
  <Route
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
