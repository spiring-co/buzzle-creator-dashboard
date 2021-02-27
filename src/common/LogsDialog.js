import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@material-ui/core";

export default ({ logs = "", onClose }) => {
  const logsRef = useRef(null);
  const scrollToBottom = () => {
    logsRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };
  useEffect(() => {
    if (logsRef?.current) {
      scrollToBottom();
    }
  }, [logs, logsRef]);
  return (
    <>
      <Dialog
        fullWidth
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={true}>
        <DialogTitle id="simple-dialog-title">Logs</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "black",
          }}>
          <code
            ref={logsRef}
            style={{
              "white-space": "pre-line",
              padding: 10,
              display: "flex",
              paddingBottom: 100,
              fontSize: 14,
              fontFamily: "monospace",
              fontWeight: 600,
            }}>
            {logs}
          </code>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
