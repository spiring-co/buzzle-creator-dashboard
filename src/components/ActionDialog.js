import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import React from "react";

export default ({ title, handleClose, children, onSubmit }) => {
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
