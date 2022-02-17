import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import * as Yup from "yup";
import { useFormik } from "formik";

import ManualTestJob from "./manualTestJob";
import { useAPI } from "services/APIContext";

import {
  Box,
  Button,
  // Dialog,
  // DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  FormGroup,
  Checkbox,
  MenuItem,
  Radio,
  RadioGroup,
  FormHelperText,
  Select,
  TextField,
} from "@material-ui/core";

import createTestJobs from "helpers/createTestJobs";

const validationSchema = Yup.object().shape({
  versions: Yup.array()
    .required("Atleast 1 one version should be selected!")
    .min(1),
});

export default (props) => {
  const { videoTemplate = {}, versions = [] } = props?.location?.state;
  const history = useHistory();
  const { Job } = useAPI()

  const [manualJob, setManualJob] = useState([]);
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      versions: [],
      dataFillType: "maxLength",
      incrementFrame: 1,
      renderSettings: "h264",
      settingsTemplate: "half",
    },
    validationSchema,
    onSubmit: async (options) => {
      if (manualJob.length) {
        try {
          const { settingsTemplate, renderSettings, incrementFrame } = options;
          console.log("its a manual job", manualJob, videoTemplate);
          await Promise.all(
            manualJob.map(async (m) => {
              const idVersion = Object.keys(m)[0];
              await Job.create({
                idVideoTemplate: videoTemplate.id,
                idVersion: idVersion,
                renderPrefs: {
                  settingsTemplate,
                  incrementFrame,
                  renderSettings,
                },
                data: m[idVersion],
              });
            })
          );
          return history.push("/home/jobs");
        } catch (e) {
          console.log(e);
        }
      }
      const jobs = await createTestJobs(videoTemplate.id, options);
      console.log("jobss are", jobs, videoTemplate);
      await Promise.all(jobs.map(Job.create));
      history.push("/home/jobs");
    },
  });

  const handleVersionChoose = (versionId, checked) => {
    setFieldTouched("versions", true);
    const isPresent = Boolean(
      values.versions.filter(({ id }) => id === versionId)?.length ?? false
    );
    if (isPresent) {
      //check if version Id exist remove it from versions
      setFieldValue(
        "versions",
        values.versions.filter(({ id }) => id !== versionId)
      );
    } else {
      // add it to versions
      setFieldValue("versions", [
        ...values.versions,
        versions.find(({ id }) => id === versionId),
      ]);
    }
  };

  const onSubmitJob = (data, versionId) => {
    setManualJob([...manualJob, { [versionId]: data }]);
  };
  return (
    <div>
      <Box as="form" onSubmit={handleSubmit} p={4} mb={2}>
        <FormControl
          required
          error={touched.versions && errors.versions}
          component="fieldset">
          <FormLabel component="legend">Choose Versions</FormLabel>
          <FormGroup row>
            {versions?.map((item, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={Boolean(
                      values.versions?.filter(({ id }) => id === item?.id)
                        ?.length ?? false
                    )}
                    onChange={({ target: { checked } }) =>
                      handleVersionChoose(item?.id, checked)
                    }
                  />
                }
                label={item?.title}
              />
            ))}
          </FormGroup>
          <FormHelperText error={touched.versions && errors.versions}>
            {errors.versions}
          </FormHelperText>
        </FormControl>
        <br />
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
            <FormControlLabel
              value="manual"
              control={<Radio />}
              label="Manual"
            />
          </RadioGroup>
        </FormControl>
        {values.dataFillType === "manual" && videoTemplate !== {} ? (
          values.versions.map((version) => (
            <ManualTestJob
              edit={false}
              version={version} //version.id
              onSubmitJob={(d) => onSubmitJob(d, version.id)}></ManualTestJob>
          ))
        ) : (
          <div></div>
        )}

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
            label="Output Module"
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
            label="Render Settings Template"
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
    </div>
  );
};
