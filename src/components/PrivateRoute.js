import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "services/auth";
export default (props) => {
  const { user } = useAuth();
  console.log("Private Route", user);
  if (!user) return <Redirect to="/login" />;
  return <Route {...props} />;
};
