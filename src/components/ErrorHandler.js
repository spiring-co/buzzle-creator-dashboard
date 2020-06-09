import React from "react"
import { Paper, Container, Typography, Button } from "@material-ui/core"
import { Alert } from "@material-ui/lab";

export default ({ message, showRetry, onRetry }) => {
    return <Alert
        variant="filled"
        style={{ marginBottom: 20 }}
        severity="error"
        children={message}
        action={
            showRetry && <Button
                onClick={onRetry}
                color="inherit" size="small">
                Retry?
      </Button>
        }
    />

}