import React, { useEffect, useContext } from "react";
import ProjectFilePicker from "components/ProjectFilePicker";
import { useFormik } from "formik";
import Button from "react-bootstrap/Button";
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
  // useEffect(() => {
  //   Object.keys(restoredValues).map((key) =>
  //     setFieldValue(key, restoredValues[key])
  //   );
  // }, [restoredValues]);
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      noValidate
      className="mb-3 mt-3"
    >
      <Form.Group>
        <Form.Label>Project File</Form.Label>
        <Form.Control
          as={ProjectFilePicker}
          onData={(f) => setFieldValue("projectFile", f)}
          value={values.projectFile}
          name={"projectFile"}
          placeholder="Pick or drop project file"
        />
        <Form.Control.Feedback type="invalid">
          {errors.projectFile}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label> Title</Form.Label>
        <Form.Control
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.title}
          name={"title"}
          type="text"
          placeholder="Enter title"
          isInvalid={touched.title && !!errors.title}
        />
        <Form.Control.Feedback type="invalid">
          {errors.title}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Do not include generic terms like 'video', 'template' etc. in your
          title.
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label> Description</Form.Label>
        <Form.Control
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.description}
          name={"description"}
          as="textarea"
          rows="3"
          placeholder="Enter description"
          isInvalid={touched.description && !!errors.description}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Keep your description short and simple.
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>Tags</Form.Label>
        <Form.Control
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.tags}
          name={"tags"}
          type="text"
          placeholder="Enter tags"
          isInvalid={touched.tags && !!errors.tags}
        />
        <Form.Control.Feedback type="invalid">
          {errors.tags}
        </Form.Control.Feedback>
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        children={isSubmitting ? "Loading..." : "Next"}
        disabled={isSubmitting}
      />
    </Form>
  );
};
