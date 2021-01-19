import React from "react";

import * as Yup from "yup";
import { useFormik } from "formik";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";

const validationSchema = Yup.object().shape({
  rejectionReason: Yup.string().required("Reason is required!"),
});

export default ({ onClose, open, value = "", onSubmit }) => {
  const handleClose = () => {
    onClose();
  };

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
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
        <Button disabled={isSubmitting} color="primary" onClick={handleClose}>
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
