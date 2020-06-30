import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { SaveIcon } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import { useFormik } from "formik";
import {
  Typography,
  Container,
  Divider,
  Box,
  Button,
  TextField,
} from "@material-ui/core";
import { Creator } from "services/api";
import { Alert } from "@material-ui/lab";
import { useAuth } from "services/auth";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function ProfileEdit({ creator }) {
  const [isEditing, setIsEditing] = useState(false);
  const handleUpdate = (data) => {
    setIsEditing(false);
    Creator.update(data);
    console.log(data);
  };
  const { handleChange, values, handleSubmit } = useFormik({
    initialValues: {
      name: creator.name,
      email: creator.email,
    },
    validationSchema: null,
    onSubmit: handleUpdate,
  });

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box p={2}>
        <Box style={{ marginBottom: 20 }} display="flex" flexDirection="column">
          <div style={{ marginBottom: 10 }}>
            <TextField
              variant="outlined"
              onChange={handleChange}
              label="Name"
              name="name"
              margin="dense"
              value={values.name}
              inputProps={{
                readOnly: !isEditing,
              }}></TextField>
          </div>
          <div>
            <TextField
              variant="outlined"
              onChange={handleChange}
              label="Email"
              name="email"
              margin="dense"
              value={values.email}
              inputProps={{
                readOnly: !isEditing,
              }}></TextField>
          </div>
        </Box>
        <Button
          style={
            isEditing
              ? { marginRight: 20, background: "green" }
              : { marginRight: 20, background: "blue" }
          }
          onClick={isEditing ? handleSubmit : toggleEditMode}
          size="small"
          variant="contained">
          {isEditing ? "Save" : "Edit"}
        </Button>
      </Box>
    </form>
  );
}

export default function DisabledTabs() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [creator, setCreator] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    Creator.get(user?.id)
      .then((c) => {
        setCreator(c);
        setLoading(false);
      })
      .catch(setError);
  }, []);

  if (loading) {
    return <Typography>loading...</Typography>;
  }

  const handleTabChange = (event, newValue) => {
    setActiveTabIndex(newValue);
  };

  return (
    <Container>
      <Typography variant="h4">Your account</Typography>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Divider />
      <Paper square>
        <Tabs
          value={activeTabIndex}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
          aria-label="account tabs">
          <Tab label="Profile" />
          <Tab label="Settings" />
        </Tabs>
        <TabPanel value={activeTabIndex} index={0}>
          <ProfileEdit creator={creator} />
        </TabPanel>
      </Paper>
    </Container>
  );
}
