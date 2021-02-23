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
  editingValue = { url: "", id: "" },
  webhookData,
}) {
  const [value, setValue] = useState(editingValue);
  const classes = useStyles();
  const userWebhooksNames =
    currentUser !== null
      ? currentUser.webhooks.map((w) => {
          return w.name;
        })
      : [];
  const userWebhooks =
    currentUser !== null
      ? currentUser.webhooks.map((w) => {
          return w;
        })
      : [];

  console.log(userWebhooksNames);
  console.log(userWebhooks);
  useEffect(() => {
    console.log(value);
  }, [value]);

  const handleChange = (event) => {
    setValue({ ...value, id: event.target.value });
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
              value={value.id}
              style={{ width: 150 }}
              onChange={handleChange}>
              {webhookData?.map((w) => {
                return <MenuItem value={w?.id}>{w?.name}</MenuItem>;
              })}
            </Select>
          </Container>
          <TextField
            name="url"
            key="random1"
            variant="outlined"
            size="small"
            onChange={(event) => {
              setValue({ ...value, url: event.target.value });
            }}
            style={{ marginLeft: 30 }}
            value={value.url}
            label="URL"></TextField>
          <Button
            onClick={() => onSubmit(value)}
            style={{ marginLeft: 10 }}
            variant="contained">
            Set
          </Button>
        </div>
      </Fade>
    </Modal>
  );
}
