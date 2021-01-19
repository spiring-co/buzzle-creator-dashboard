import React from "react";
import { Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export default ({ message, showRetry, onRetry }) => {
  return (
    <Alert
      style={{ marginBottom: 20 }}
      severity="error"
      children={message}
      action={
        showRetry && (
          <Button onClick={onRetry} color="inherit" size="small">
            Retry
          </Button>
        )
      }
    />
  );
};
