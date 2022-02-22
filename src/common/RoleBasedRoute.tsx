import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "services/auth";
export default (props: any) => {
  const { user, isUserLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(!(!user && !isUserLoading))
  useEffect(() => {
    setIsAuthorized(!(!user && !isUserLoading))
  }, [user, isUserLoading])
  if (!isAuthorized) return <Redirect to="/login" />;
  if (!props.allowedRoles?.includes(user?.role) && props.allowedRoles !== '*')
    return <Redirect to="/NotFound" />;
  return <Route {...props} />;
};
