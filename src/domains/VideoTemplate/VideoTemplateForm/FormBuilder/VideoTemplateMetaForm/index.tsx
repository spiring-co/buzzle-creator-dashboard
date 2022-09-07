import React, { useEffect, useState } from "react";

import * as Yup from "yup";
import { useFormik } from "formik";

import { ArrowForward } from "@material-ui/icons";
import { Button, TextField, FormHelperText, Radio, FormControlLabel, RadioGroup, FormControl, Typography, Box, CircularProgress } from "@material-ui/core";

import ProjectFilePicker from "./ProjectFilePicker";
import ArrayInput from "common/ArrayInput";
import FileUploader from "common/FileUploader";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is Required"),
  projectFile: Yup.object().required("Project File is required").nullable(),
  orientation: Yup.string().oneOf(["landscape", "portrait"]).required("Video orientation is required"),
  thumbnail: Yup.string().required("Thumbnail is required!"),
});
type IProps = {
  initialValues?: any,
  isEdit: boolean,
  type?: "ae" | "remotion",
  assets: Array<{ name: string, type: 'static', src: string }>,
  compositions: any,
  onSubmit: Function,
}
export default ({
  initialValues = {},
  isEdit,
  type = 'ae',
  assets,
  compositions,
  onSubmit,
}: IProps) => {
  const [keywords, setKeywords] = useState(initialValues?.keywords ?? []);
  const [isExtractionDone, setIsExtractionDone] = useState<boolean>(false)
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
      <Box style={{ marginBottom: 20 }}>
        <ProjectFilePicker
          templateType={type}
          isEdit={isEdit}
          assets={assets}
          compositions={compositions}
          onData={(value: any) => {
            setIsExtractionDone(true)
            setFieldValue("projectFile", value)
          }}
          onError={(message) => {
            setFieldTouched("projectFile", !!message, false)
            setFieldError("projectFile", message)
          }}
          onTouched={(value) => setFieldTouched("projectFile", value, false)}
          value={values.projectFile}
          name={"projectFile"}
          placeholder={`Drag & Drop Your ${type === 'remotion' ? "Remotion project zip file here" : "After effects file here"}`}
        />
        {touched?.projectFile && errors.projectFile && (
          <FormHelperText error={true}>{errors.projectFile}</FormHelperText>
        )}
      </Box>
      <FileUploader
        storageType="archive"
        required={true}
        accept={"image/*"}
        value={values.thumbnail}
        onError={(message) => {
          setFieldTouched("thumbnail", !!message, false)
          setFieldError("thumbnail", message)
        }}
        onChange={(value: string) => setFieldValue("thumbnail", value)}
        uploadDirectory={"thumbnails"}
        label="Template Thumbnail"
        onTouched={(value: boolean) => setFieldTouched("thumbnail", value, false)}
        error={touched.thumbnail && !!errors.thumbnail
          ? new Error(errors?.thumbnail as string)
          : undefined}
        helperText={"Thumbnail for video template"}
        name={"thumbnail"}
      />
      <Typography>Video orientation *</Typography>
      <FormControl style={{ marginBottom: 15 }} component="fieldset">
        <RadioGroup
          aria-label="orientation"
          name="orientation"
          value={values.orientation}
          onChange={({ target: { value } }) => {
            setFieldValue("orientation", value, false)
          }}
          row>
          <FormControlLabel value="portrait" control={<Radio />} label="Portrait" />
          <FormControlLabel value="landscape" control={<Radio />} label="Landscape" />
        </RadioGroup>
        <FormHelperText error={!!errors.orientation}>
          {!!errors.orientation ? errors.orientation : ""}
        </FormHelperText>
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
        disabled={false}
        maxKeywords={5}
        onChange={setKeywords}
        placeholder="Enter Keywords"
        label="Keywords"
        keywords={keywords}
      />
      <Box display="flex" justifyContent="space-between" mt={4}>
        <div />
        <Button
          endIcon={<ArrowForward color="inherit" fontSize="small" />}
          color="primary"
          style={{ marginTop: 5, alignSelf: 'flex-end' }}
          variant="contained"
          type="submit"
          children={isSubmitting ? <CircularProgress color="inherit" size={20} /> : "Next"}
          disabled={isSubmitting || !isExtractionDone}
        />
      </Box>
    </form >
  );
};
