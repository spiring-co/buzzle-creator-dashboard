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
    initialValues,
    setIsDialogOpen,
    onSubmit,
}) => {

    const {
        values,
        errors,
        touched,
        handleBlur,
        handleSubmit,
        handleChange,
    } = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <Dialog
            fullWidth
            open
            onClose={() => setIsDialogOpen(false)}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{"Action Details"}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Typography>Here comes Details</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="primary">
                        Cancel
          </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        children={"Save Action"}
                    />
                </DialogActions>
            </form>
        </Dialog>
    );
};
