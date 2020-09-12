import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel, FormGroup, Checkbox,
    MenuItem,
    Radio,
    RadioGroup, FormHelperText,
    Select,
    TextField, DialogActions, DialogContent
} from "@material-ui/core";
import { apiClient } from "buzzle-sdk";
import { useFormik } from "formik";
import createTestJobs from "helpers/createTestJobs";
import React from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

const { Job } = apiClient({
    baseUrl: process.env.REACT_APP_API_URL,
    authToken: localStorage.getItem("jwtoken"),
});
const validationSchema = Yup.object().shape({
    rejectionReason: Yup.string()
        .required('Reason is required!')
});
export default ({ onClose, open, value = "", onSubmit }) => {
    const handleClose = () => {
        onClose();
    };
    const history = useHistory();

    const {
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched, setFieldValue, setFieldTouched,
        isSubmitting,
    } = useFormik({
        initialValues: {
            rejectionReason: value,
        },
        validationSchema,
        onSubmit,
    });


    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            open={open}>
            <DialogTitle id="simple-dialog-title">Confirm Rejection</DialogTitle>
            <DialogContent as={"form"} dividers>
                <TextField
                    name={"rejectionReason"}
                    margin="dense"
                    multiline={true}
                    rows={5}
                    value={values.rejectionReason}
                    label="Rejection reason"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.rejectionReason && !!errors.rejectionReason}
                    helperText={touched.rejectionReason && errors.rejectionReason}
                    fullWidth
                    variant={"outlined"}
                    placeholder="Enter feedback"
                />

            </DialogContent>
            <DialogActions>
                <Button
                    disabled={isSubmitting}
                    color="primary"
                    onClick={handleClose}
                >
                    cancel
            </Button>
                <Button
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    type="submit">
                    Submit
            </Button>
            </DialogActions>
        </Dialog>
    );
};
