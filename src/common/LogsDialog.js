import React, { useEffect, useRef, useState } from "react";
import {
  Dialog, Box,
  DialogTitle,
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@material-ui/core";

export default ({ logs = [], onClose }) => {
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

  const logColors = {
    warning: "yellow",
    info: "#fff",
    error: "red",

  }
  return (
    <>
      <Dialog
        fullWidth
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        open={true}>
        <DialogTitle id="simple-dialog-title">Logs</DialogTitle>
        <DialogContent
          ref={logsRef}
          style={{
            display: "flex",
            backgroundColor: "black", paddingBottom: 100, padding: 10, flexDirection: 'column'
          }}>
          {logs.map(({ line, data, level, timestamp = new Date().toLocaleString() }) => <Box style={{ display: 'flex' }}>
            <code
              style={{
                "white-space": "pre-line",
                fontSize: 14,
                fontFamily: "monospace",
                fontWeight: 600, color: '#fff',
                paddingRight: 10,
                textAlign: 'right',
                minWidth: 40,
                "border-right": "0.2px solid #fff"
              }}>
              {`${line}`}
            </code>
            <code
              style={{
                "white-space": "pre-line",
                paddingLeft: 35,
                fontSize: 14,
                fontFamily: "monospace",
                fontWeight: 600, color: logColors[level]
              }}>
              {timestamp}: {data?.toString()?.replace(/,/g, "\n")}
            </code>
          </Box>)}
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
