import { Button, TextField } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";
import ArrayInput from "components/ArrayInput";
import FileUploader from "components/FileUploader";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is Required"),
  //   thumbnail: Yup.string().required("Thumbnail is required!"),
});

export default ({ value = {}, onSubmit }) => {
  const [keywords, setKeywords] = useState(value?.keywords ?? []);
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
    initialValues: value,
    validationSchema,
    onSubmit: (values) => {
      onSubmit({ ...values, keywords });
    },
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FileUploader
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
