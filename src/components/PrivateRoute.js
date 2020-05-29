import React from "react";
import { Route } from "react-router-dom";
import useAuth from "services/auth";
export default ({ children, ...rest }) => {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      {...rest}
      render={() => (isAuthenticated ? children : (window.location = "/login"))}
    />
  );
};
