import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@material-ui/core";
import { apiClient } from "buzzle-sdk";
import { useFormik } from "formik";
import createTestJobs from "helpers/createTestJobs";
import React from "react";
import { useHistory } from "react-router-dom";

const { Job } = apiClient({
  baseUrl: process.env.REACT_APP_API_URL,
  authToken: localStorage.getItem("jwtoken"),
});

export default ({ onClose, open, idVideoTemplate }) => {
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
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      dataFillType: "maxLength",
      incrementFrame: 1,
      renderSettings: "h264",
      settingsTemplate: "half",
    },
    onSubmit: async (options) => {
      console.log(idVideoTemplate, options);
      const jobs = await createTestJobs(idVideoTemplate, options);
      console.log(jobs);
      await Promise.all(jobs.map(Job.create));
      history.push("/home/jobs");
    },
  });

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}>
      <DialogTitle id="simple-dialog-title">Configure Test Job</DialogTitle>
      <Box as="form" onSubmit={handleSubmit} p={4} mb={2}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Data Fill Type</FormLabel>
          <RadioGroup
            aria-label="dataFillType"
            name="dataFillType"
            value={values.dataFillType}
            onChange={handleChange}>
            <FormControlLabel
              value="maxLength"
              control={<Radio />}
              label="Max Length"
            />
            <FormControlLabel
              value="label"
              control={<Radio />}
              label="Labels"
            />
            <FormControlLabel
              value="placeholder"
              control={<Radio />}
              label="Placeholder"
            />
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel htmlFor="settingsTemplate">Output Module</InputLabel>
          <Select
            name={"settingsTemplate"}
            value={values.settingsTemplate}
            margin="dense"
            onBlur={handleBlur}
            onChange={handleChange}
            error={touched.settingsTemplate && !!errors.settingsTemplate}
            fullWidth
            placeholder={"Settings Template"}
            variant={"outlined"}
            inputProps={{
              name: "settingsTemplate",
              id: "settingsTemplate",
            }}>
            <MenuItem aria-label="None" value="" />
            <MenuItem value={"half"}>Half</MenuItem>
            <MenuItem value={"full"}>Full</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel htmlFor="renderSettings">
            Render Settings Template
          </InputLabel>
          <Select
            name={"renderSettings"}
            value={values.renderSettings}
            margin="dense"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={"Render Settings"}
            error={touched.renderSettings && !!errors.renderSettings}
            fullWidth
            variant={"outlined"}
            inputProps={{
              name: "renderSettings",
              id: "renderSettings",
            }}>
            <MenuItem aria-label="None" value="" />
            <MenuItem value={"h264"}>h264</MenuItem>
          </Select>
        </FormControl>
        <TextField
          name={"incrementFrame"}
          margin="dense"
          value={values.incrementFrame}
          label="Frame Increment"
          onBlur={handleBlur}
          onChange={handleChange}
          error={touched.incrementFrame && !!errors.incrementFrame}
          fullWidth
          type={"number"}
          variant={"outlined"}
          placeholder="Frame Increment"
        />
        {/* <TextField
          name="frameStart"
          label="Start Frame"
          type="number"
          value={values.frameStart}
          margin="dense"
          onBlur={handleBlur}
          onChange={handleChange}
          error={touched.frameStart && !!errors.frameStart}
          fullWidth
          variant={"outlined"}
          placeholder="Frame Start"
        />
        <TextField
          name="frameEnd"
          label="Frame End"
          type="number"
          margin="dense"
          value={values.frameEnd}
          onBlur={handleBlur}
          onChange={handleChange}
          error={touched.frameEnd && !!errors.frameEnd}
          fullWidth
          variant={"outlined"}
          placeholder="Frame End"
        /> */}
        <Box mb={2}>
          <Button
            disabled={isSubmitting}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            type="submit">
            Submit
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
