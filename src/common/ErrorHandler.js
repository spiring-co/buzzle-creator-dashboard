import React from "react";
import { Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export default ({ type='error',message, showRetry, onRetry,retryText="Retry" }) => {
  return (
    <Alert
      style={{ marginBottom: 20 }}
      severity={type}
      children={message}
      action={
        showRetry && (
          <Button onClick={onRetry} color="inherit" size="small">
           {retryText}
          </Button>
        )
      }
    />
  );
};
