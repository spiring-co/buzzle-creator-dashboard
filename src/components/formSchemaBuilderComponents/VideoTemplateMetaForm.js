import { Button, TextField, Chip, FormHelperText } from "@material-ui/core";
import ProjectFilePicker from "components/ProjectFilePicker";

import { ArrowForward } from "@material-ui/icons";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is Required"),
  projectFile: Yup.object().required("Project File is required"),
});

export default ({ initialValues = {}, onSubmit }) => {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(initialValues?.tags ?? []);
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
      onSubmit({ ...values, tags });
    },
  });

  const handleTagInput = (value) => {
    if (
      (value.substr(-1) === "," || value.substr(-1) === " ") &&
      value.substr(0, 1) !== " " &&
      value.substr(0, 1) !== ","
    ) {
      setTags([...tags, value.substr(0, value.length - 1)]);
      setTagInput("");
    } else {
      setTagInput(value);
    }
  };

  const handleDelete = (tagValue) => {
    // delete the tag
    setTags(tags.filter((tag) => tag !== tagValue));
  };
  return (
    <form onSubmit={handleSubmit} noValidate>
      <ProjectFilePicker
        as={ProjectFilePicker}
        onData={(f) => setFieldValue("projectFile", f)}
        onError={(e) => setFieldError("projectFile", e)}
        onTouched={(e) => setFieldTouched("projectFile", e)}
        value={values.projectFile}
        name={"projectFile"}
        placeholder="Pick or drop project file"
      />
      {touched.projectFile && errors.projectFile && (
        <FormHelperText error>Error: {errors.projectFile}</FormHelperText>
      )}
      <TextField
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

      {/* TODO should be a separate component */}
      <TextField
        fullWidth
        margin={"dense"}
        disabled={tags.length >= 5}
        variant={"outlined"}
        onChange={({ target: { value } }) => handleTagInput(value)}
        value={tagInput}
        type="text"
        placeholder="Enter tags"
        label="Tags"
        error={
          tags.length > 5 ||
          tagInput.substr(0, 1) === " " ||
          tagInput.substr(0, 1) === ","
        }
        helperText={
          tagInput.substr(0, 1) === " " || tagInput.substr(0, 1) === ","
            ? "Invalid Tag Value"
            : "You can add maximum of 5 tags"
        }
        InputProps={{
          startAdornment: tags.map((tag, index) => {
            return (
              <Chip
                key={index}
                style={{ margin: 6 }}
                size="small"
                label={tag}
                onDelete={() => handleDelete(tag)}
              />
            );
          }),
        }}
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
