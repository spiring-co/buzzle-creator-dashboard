import { CircularProgress, Container, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "services/auth";
export default (props) => {
  const { user, initializing = false ,isAuthorized} = useAuth();
 
  if (initializing||(!user&&isAuthorized)) {
    return <Container style={styles.center}>
      <Typography style={{ padding: 15 }}>Please wait, while we sign in you</Typography>
      <CircularProgress />
    </Container>
  }
  if (!isAuthorized) return <Redirect to="/login" />;
  return <Route {...props} />;
};

const styles = {
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100%' }
}