import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Typography, Container, Divider, Box } from "@material-ui/core";
import { Creator } from "services/api";
import { Alert } from "@material-ui/lab";
import useAuth from "services/auth";

export default function DisabledTabs() {
  const [value, setValue] = useState(0);
  const [creator, setCreator] = useState({});
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    Creator.get(user?.id).then(setCreator).catch(setError);
  }, []);

  return (
    <Container>
      <Typography variant="h4">Your account</Typography>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Divider />
      <Paper square>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="account tabs">
          <Tab label="Profile" />
          <Tab label="Settings" />
        </Tabs>
        <Box>
          {Object.keys(creator || {}).map((k) => (
            <Box key={k}>
              <Typography>
                {k}- {creator[k]}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
}
