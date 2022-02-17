import React from "react";
import { Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
type IProps = {
  message: string,
  showRetry?: boolean,
  onRetry?: Function,
  buttonText?: string,
  severity?: "info" | "warning" | "error" | "success"
}
export default ({ message, showRetry, onRetry, severity = "error", buttonText }: IProps) => {
  return (
    <Alert
      style={{ marginBottom: 20 }}
      severity={severity}
      children={message}
      action={
        onRetry && (
          <Button
            onClick={() => onRetry()}
            color="inherit"
            size="small">
            {buttonText || "Retry"}
          </Button>)
      }
    />
  );
};
