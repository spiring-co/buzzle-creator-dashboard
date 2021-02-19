import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
  Tooltip,
  InputLabel,
  MenuItem,
  Select,
  Input,
  Modal,
  Backdrop,
  Fade,
  IconButton,
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { Alert } from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import { Job, VideoTemplate, Creator } from "services/api";
import upload from "services/s3Upload";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import { useAuth } from "services/auth";
import VerticalTabs from "common/VerticalTabs";
import { Prompt } from "react-router-dom";
import ChangePassword from "domains/Auth/ChangePassword";
import WebhookModal from "../Components/webhookModal.js";

function ProfileEdit({ creator }) {
  console.log("creator is:" + JSON.stringify(creator));
  const [isBlocking, setIsBlocking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleUpdate = (data) => {
    setIsBlocking(false);
    Creator.update(creator?.id, data);
  };

  useEffect(() => {
    document.title = "Profile";
  }, []);

  const { handleChange, values, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      name: creator.name,
      email: creator.email,
      imageUrl: creator?.imageUrl,
    },
    validationSchema: null,
    onSubmit: handleUpdate,
  });

  const handleUpload = async (file, extension) => {
    try {
      setLoading(true);
      const task = upload(`avtars/${Date.now()}${extension}`, file);
      task.on("httpUploadProgress", ({ loaded, total }) =>
        setProgress(parseInt((loaded * 100) / total))
      );
      const { Location: uri } = await task.promise();
      setLoading(false);
      setFieldValue("imageUrl", uri);
      console.log(uri);
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Container style={{ padding: 15 }}>
        <Typography variant="h5">Profile</Typography>
      </Container>
      <Prompt
        when={isBlocking}
        message={`Do you want to leave, Changes will be unsaved.`}
      />
      <Divider />
      <Box p={2}>
        <Box style={{ marginBottom: 20 }} display="flex" flexDirection="column">
          <Box
            style={{
              height: 180,
              width: 180,
              margin: 10,
              borderRadius: "50%",
              alignSelf: "flex-start",
              border: "1px solid #f0f8ff",
              position: "relative",
              background: "#f0f8ff",
            }}>
            {values?.imageUrl && (
              <img
                style={{
                  width: "inherit",
                  height: "inherit",
                  borderRadius: "inherit",
                }}
                src={values?.imageUrl}
              />
            )}
            <Paper
              style={{
                position: "absolute",
                left: 5,
                bottom: 15,
                paddingLeft: 15,
                paddingRight: 15,
                borderRadius: 15,
              }}>
              <label>
                <EditIcon fontSize="small" />{" "}
                {loading ? `Uploading : ${progress}%` : "Edit"}
                {!loading && (
                  <input
                    style={{ display: "none" }}
                    onChange={({ target: { files } }) =>
                      handleUpload(
                        files[0],
                        files[0].name.substr(files[0].name.lastIndexOf("."))
                      )
                    }
                    type="file"
                    accept={"image/*"}
                  />
                )}
              </label>
            </Paper>
          </Box>

          <div style={{ marginBottom: 10 }}>
            <TextField
              variant="outlined"
              onChange={handleChange}
              label="Name"
              name="name"
              margin="dense"
              value={values.name}></TextField>
          </div>
          <div>
            <TextField
              variant="outlined"
              onChange={handleChange}
              label="Email"
              name="email"
              margin="dense"
              value={values.email}></TextField>
          </div>
        </Box>
        <Button
          disabled={loading}
          onClick={handleSubmit}
          size="small"
          color="primary"
          variant="contained">
          Update
        </Button>
      </Box>
    </form>
  );
}

function APISection() {
  return (
    <Container>
      <Container style={{ padding: 15 }}>
        <Typography variant="h5">Credentials</Typography>
      </Container>
      <Divider />
      <Typography>API KEY</Typography>
      <Typography></Typography>
    </Container>
  );
}

function Setting() {
  return (
    <Container>
      <Container style={{ padding: 15 }}>
        <Typography variant="h5">Setting</Typography>
      </Container>
      <Divider />
    </Container>
  );
}

function Webhooks() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [webhookData, setWebhookData] = useState([]);
  const [error, setError] = useState("");

  const handleOpen = (i) => {
    setEditIndex(i);
    setEditing(currentUser.webhooks[i]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetch("http://localhost:5000/webhooks/")
      .then((response) => response.json())
      .then((data) => setWebhookData(data))
      .catch((err) => setError(err));
    console.log(JSON.stringify(user));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/users/${user?.id}`)
      .then((response) => response.json())
      .then((data) => setCurrentUser(data));
  }, []);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  const handleSubmit = (value) => {
    console.log(value);
    let newUserWebhooksData = currentUser.webhooks;
    if (editIndex === null) {
      newUserWebhooksData.push(value);
      console.log(newUserWebhooksData);
    } else {
      newUserWebhooksData[editIndex] = value;
      console.log(newUserWebhooksData);
    }
    fetch(`http://localhost:5000/users/${user?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im9XSXRWSE5xOCIsImVtYWlsIjoic2hpdmFtLjExOTk2NkB5YWhvby5jb20iLCJuYW1lIjoic2hpdmFtIHR5YWdpIiwicm9sZSI6IkFkbWluIiwiaW1hZ2VVcmwiOiJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYwMDYwNDQ3NzM3MS03ZjJkZGY3ODJhMmI_aXhsaWI9cmItMS4yLjEmYXV0bz1mb3JtYXQmZml0PWNyb3Amdz02MTkmcT04MCIsImlhdCI6MTYxMDk2NjcwOCwiZXhwIjoxNjEzNTU4NzA4fQ.ZG5E2d9tc6C2JqT3DnqpxfPyGmQVEixsOUYeLTatUbY",
      },
      body: JSON.stringify({
        webhooks: newUserWebhooksData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDelete = (index) => {
    if (index !== null) {
      let newUserWebhooksData = currentUser.webhooks.filter(
        (item, i) => i !== index
      );
      console.log(newUserWebhooksData);
      fetch(`http://localhost:5000/users/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im9XSXRWSE5xOCIsImVtYWlsIjoic2hpdmFtLjExOTk2NkB5YWhvby5jb20iLCJuYW1lIjoic2hpdmFtIHR5YWdpIiwicm9sZSI6IkFkbWluIiwiaW1hZ2VVcmwiOiJodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTYwMDYwNDQ3NzM3MS03ZjJkZGY3ODJhMmI_aXhsaWI9cmItMS4yLjEmYXV0bz1mb3JtYXQmZml0PWNyb3Amdz02MTkmcT04MCIsImlhdCI6MTYxMDk2NjcwOCwiZXhwIjoxNjEzNTU4NzA4fQ.ZG5E2d9tc6C2JqT3DnqpxfPyGmQVEixsOUYeLTatUbY",
        },
        body: JSON.stringify({
          webhooks: newUserWebhooksData,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          // window.location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
          // window.location.reload();
        });
    }
  };

  return (
    <Container style={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h5">Webhooks</Typography>
      <Divider />
      {currentUser
        ? currentUser?.webhooks.map((cu, index) => {
          return (
            <div>
              <Typography style={{ margin: 10 }} variant="h7">
                Name:{" "}
                {webhookData.find(({ id }) => id === cu.id).name}
              </Typography>
              <Typography variant="h7">URL: {cu.url}</Typography>
              <IconButton>
                <Edit onClick={() => handleOpen(index)} fontSize="small" />
              </IconButton>
              <IconButton>
                <Delete
                  fontSize="small"
                  onClick={() => handleDelete(index)}
                />
              </IconButton>
              <Divider />
            </div>
          );
        })
        : " "}
      <Button
        style={{ marginTop: 20 }}
        size="small"
        type="button"
        onClick={() => handleOpen(null)}
        variant="contained">
        Add a Webhook
      </Button>
      {open ? (
        <WebhookModal
          editingValue={editing}
          handleClose={handleClose}
          open={open}
          user={user}
          currentUser={currentUser}
          onSubmit={handleSubmit}
          webhookData={webhookData.filter(({ id }) =>
            currentUser.webhooks.find((i) => i.id !== id)
          )}></WebhookModal>
      ) : (
          <div> </div>
        )}
    </Container>
  );
}

export default () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [creator, setCreator] = useState({});
  const [error, setError] = useState(null);
  useEffect(() => {
    Creator.get(user?.id)
      .then((c) => {
        setCreator(c);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return <Typography>loading...</Typography>;
  }
  return (
    <Container>
      {error && <Alert severity="error">{error.message}</Alert>}
      <Divider />
      <VerticalTabs
        tabs={[
          {
            label: "Profile",
            component: <ProfileEdit creator={creator} />,
            allowedRoles: ["Admin", "Creator", "Platform"],
          },
          {
            label: "Account Security",
            component: <ChangePassword />,
            allowedRoles: ["Admin", "Creator", "Platform"],
          },
          {
            label: "Credentials",
            component: <APISection />,
            allowedRoles: ["Platform"],
          },
          {
            label: "Setting",
            component: <Setting />,
            allowedRoles: ["Admin", "Creator", "Platform"],
          },
          {
            label: "Webhooks",
            component: <Webhooks />,
            allowedRoles: ["Admin", "Creator", "Platform"],
          },
        ]}
      />
    </Container>
  );
};
