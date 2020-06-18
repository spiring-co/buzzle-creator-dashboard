import React, { useState, useEffect } from "react";
import {
    DialogActions,
    Typography,
    Dialog,
    DialogContent,
    DialogTitle,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = null;

export default ({
    title,
    handleClose,
    children,
    onSubmit,
}) => {
    return (
        <Dialog
            fullWidth
            open
            onClose={handleClose}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent children={children} />

            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
          </Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    color="primary"
                    children={"Save Action"}
                />
            </DialogActions>
        </Dialog>
    );
};
