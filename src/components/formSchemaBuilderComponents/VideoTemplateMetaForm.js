import { Button, Paper, TextField } from "@material-ui/core";
import ProjectFilePicker from "components/ProjectFilePicker";
import { useFormik } from "formik";
import React from "react";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";

export default ({ restoredValues, onSubmit }) => {
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: restoredValues || {
      title: "",
      tags: [],
      description: "",
      projectFile: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is Required"),
      projectFile: restoredValues
        ? Yup.object().required("Project File is required")
        : Yup.object().required("Project File is required"),
    }),
    onSubmit,
  });

  return (
    <Paper elevation={2}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        noValidate
        style={{ background: "#fff", marginTop: 20, padding: 20 }}
      >
        <Form.Group>
          <Form.Label>Project File</Form.Label>
          <Form.Control
            as={ProjectFilePicker}
            onData={(f) => setFieldValue("projectFile", f)}
            //to restore value={values.fileUrl}
            value={values.projectFile}
            name={"projectFile"}
            placeholder="Pick or drop project file"
          />
          <Form.Control.Feedback type="invalid">
            {errors.projectFile}
          </Form.Control.Feedback>
        </Form.Group>
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
            touched.title
              ? errors?.title ??
                "Do not include generic terms like 'video', 'template' etc. in your title"
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
            touched.description
              ? errors?.description ?? "Keep your description short and simple."
              : "Keep your description short and simple."
          }
        />
        <TextField
          fullWidth
          margin={"dense"}
          variant={"outlined"}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.tags}
          name={"tags"}
          type="text"
          placeholder="Enter tags"
          label="Tags"
          error={touched.tags && !!errors.tags}
          helperText={touched.tags && errors?.tags}
        />

        <Button
          style={{ marginTop: 20 }}
          color="primary"
          variant="contained"
          type="submit"
          children={isSubmitting ? "Loading..." : "Next"}
          disabled={isSubmitting}
        />
      </form>
    </Paper>
  );
};
