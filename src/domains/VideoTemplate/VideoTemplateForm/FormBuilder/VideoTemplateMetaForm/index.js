import React, { useState } from "react";

import * as Yup from "yup";
import { useFormik } from "formik";

import { ArrowForward } from "@material-ui/icons";
import { Button, TextField, FormHelperText, Radio, FormControlLabel, RadioGroup, FormControl, Typography } from "@material-ui/core";

import ProjectFilePicker from "./ProjectFilePicker";
import ArrayInput from "common/ArrayInput";
import FileUploader from "common/FileUploader";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is Required"),
  projectFile: Yup.object().required("Project File is required").nullable(),
  orientation: Yup.string().oneOf(["landscape", "portrait"]).required("Video orientation is required"),
  thumbnail: Yup.string().required("Thumbnail is required!"),
});

export default ({
  initialValues = {},
  isEdit,
  type = 'ae',
  assets,
  compositions,
  onSubmit,
}) => {
  const [keywords, setKeywords] = useState(initialValues?.keywords ?? []);
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      onSubmit({ ...values, keywords });
    },
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ marginBottom: 20 }}>
        <ProjectFilePicker
          templateType={type}
          isEdit={isEdit}
          assets={assets}
          compositions={compositions}
          as={ProjectFilePicker}
          onData={(f) => setFieldValue("projectFile", f)}
          onError={(e) => setFieldError(e.message)}
          onTouched={setFieldTouched}
          value={values.projectFile}
          name={"projectFile"}
          placeholder={`Pick or drop project ${type === 'remotion' ? 'folder zip' : 'file'}`}
        />
        {touched?.projectFile && errors.projectFile && (
          <FormHelperText error={true}>{errors.projectFile}</FormHelperText>
        )}
      </div>
      <FileUploader
        required={true}
        accept={"image/*"}
        value={values.thumbnail}
        onError={(e) => setFieldError(e)}
        onChange={(value) => setFieldValue("thumbnail", value)}
        uploadDirectory={"thumbnails"}
        label="Template Thumbnail"
        onTouched={setFieldTouched}
        error={errors.thumbnail}
        helperText={"Thumbnails "}
        name={"thumbnail"}
      />
      <Typography>Video orientation *</Typography>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="orientation"
          name="orientation"
          value={values.orientation}
          onChange={({ target: { value } }) => setFieldValue("orientation", value)}
          row>
          <FormControlLabel value="portrait" control={<Radio />} label="Portrait" />
          <FormControlLabel value="landscape" control={<Radio />} label="Landscape" />
        </RadioGroup>
        <FormHelperText error={!!errors.orientation}>
          {!!errors.orientation ? errors.orientation : ""}
        </FormHelperText>
        <br/>
      </FormControl>
      <TextField
        required
        fullWidth
        margin={"dense"}
        variant={"outlined"}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.title}
        name={"title"}
        type="text"
        placeholder="Enter title"
        label="Title"
        error={touched.title && !!errors.title}
        helperText={
          touched.title && errors.title
            ? errors.title
            : "Do not include generic terms like 'video', 'template' etc. in your title"
        }
      />
      <TextField
        fullWidth
        margin={"dense"}
        variant={"outlined"}
        multiline={true}
        rows={3}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.description}
        name={"description"}
        type="text"
        placeholder="Enter description"
        label="Description"
        error={touched.description && !!errors.description}
        helperText={
          touched.description && errors?.description
            ? errors.description
            : "Keep your description short and simple."
        }
      />
      <ArrayInput
        fullWidth
        maxKeywords={5}
        onChange={setKeywords}
        placeholder="Enter Keywords"
        label="Keywords"
        keywords={keywords}
      />

      <Button
        endIcon={<ArrowForward />}
        color="primary"
        variant="contained"
        type="submit"
        children={isSubmitting ? "Loading..." : "Next"}
        disabled={isSubmitting}
      />
    </form>
  );
};
