import MuiAlert from '@material-ui/lab/Alert';
import { Snackbar, makeStyles, withStyles } from "@material-ui/core";
import React from 'react'
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default ({ open, message, type, onClose }) => {
    return (<Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open} autoHideDuration={5000}
        onClose={onClose}>
        <Alert
            onClose={onClose} severity={type}>
            {message}
        </Alert>
    </Snackbar>)
}