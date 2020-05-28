import React from "react"
import { Paper, Container, Typography, Button } from "@material-ui/core"

export default ({ message, showRetry, onRetry }) => {
    return <Paper style={{
        height: 300,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }}>
        <Container>
            <Typography color="secondary">
                {message}
            </Typography>
            {showRetry && <Button
                style={{ marginTop: 10 }}
                color="secondary"
                variant="outlined"
                onClick={onRetry}
                children="Retry?" />}
        </Container>
    </Paper>

}