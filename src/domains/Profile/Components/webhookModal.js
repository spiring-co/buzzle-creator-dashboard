import {
  Button,
  Container,
  TextField,
  Modal,
  Backdrop,
  Fade,
  Select,
  MenuItem,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function WebhookModal({
  handleClose,
  open,
  user,
  currentUser,
  onSubmit,
  initialValue = "",
}) {
  const [url, setUrl] = useState("");
  const [webhook, setWebhook] = useState("");
  const [webhookData, setWebhookData] = useState([]);
  const classes = useStyles();
  const userWebhooks =
    currentUser !== null
      ? currentUser.webhooks.map((w) => {
          return w.name;
        })
      : [];
  const userWebhooksData =
    currentUser !== null
      ? currentUser.webhooks.map((w) => {
          return w;
        })
      : [];
  console.log(userWebhooks);
  console.log(userWebhooksData);

  useEffect(() => {
    console.log(JSON.stringify(user));
    fetch("http://localhost:5000/webhooks/")
      .then((response) => response.json())
      .then((data) => setWebhookData(data));
  }, []);

  const handleChange = (event) => {
    setWebhook(event.target.value);
  };

  useEffect(() => {
    console.log(webhookData);
  }, [webhookData]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      className={classes.modal}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}>
      <Fade in={open}>
        <div className={classes.paper}>
          <text>ADD A WEBHOOK</text>
          <Container style={{ padding: 35 }}>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select"
              value={webhook}
              style={{ width: 150 }}
              onChange={handleChange}>
              {webhookData.map((w) => {
                if (!userWebhooks.includes(w.name))
                  return <MenuItem value={w}>{w.name}</MenuItem>;
              })}
            </Select>
          </Container>
          <TextField
            name="url"
            key="random1"
            variant="outlined"
            size="small"
            onChange={(event) => {
              setUrl(event.target.value);
            }}
            style={{ marginLeft: 30 }}
            value={url}
            label="URL"></TextField>
          <Button
            onClick={() => onSubmit(userWebhooksData, webhook, url)}
            style={{ marginLeft: 10 }}
            variant="contained">
            Set
          </Button>
        </div>
      </Fade>
    </Modal>
  );
}
