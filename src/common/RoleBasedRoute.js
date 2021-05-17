import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { CircularProgress, Container, Typography } from "@material-ui/core";
import { useAuth } from "services/auth";
export default (props) => {
  const { user, isAuthorized,initializing=false } = useAuth();

  if (initializing||(!user&&isAuthorized)) {
    return <Container style={styles.center}>
      <Typography style={{ padding: 15 }}>Please wait, while we sign in you</Typography>
      <CircularProgress />
    </Container>
  }
  if (!isAuthorized) return <Redirect to="/login" />;
  if (!props.allowedRoles?.includes(user?.role) && props.allowedRoles !== '*') {
    return <Redirect to="/NotFound" />;
  }
  return <Route {...props} />;
};

const styles = {
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100%' }
}