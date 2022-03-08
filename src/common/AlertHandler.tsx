import React from "react";
import { Button } from "@material-ui/core";
import { Alert, AlertProps, AlertTitle } from "@material-ui/lab";
type IProps = {
  message: string,
  showRetry?: boolean,
  onRetry?: Function,
  buttonText?: string,
  severity?: "info" | "warning" | "error" | "success",
  title?: string
} & AlertProps
export default ({ message, showRetry, onRetry, severity = "error", title = "", buttonText, style = {} }: IProps) => {
  return (
    <Alert
      style={{ marginBottom: 20, ...style }}
      severity={severity}

      action={
        onRetry && (
          <Button
            onClick={() => onRetry()}
            color="inherit"
            size="small">
            {buttonText || "Retry"}
          </Button>)
      }
    >
      {title ? <AlertTitle>{title}</AlertTitle> : ""}
      {message}
    </Alert>
  );
};
