import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "services/auth";
export default (props) => {
  const { user } = useAuth();
  if (!user) return <Redirect to="/login" />;
//   if (!props.allowedRoles.includes(user?.role))
//     return <Redirect to="/NotFound" />;
  return <Route {...props} />;
};
