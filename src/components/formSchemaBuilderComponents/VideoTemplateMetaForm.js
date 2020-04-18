<<<<<<< HEAD
import React, { useEffect, useContext } from "react";
import ProjectFilePicker from "components/ProjectFilePicker";
import { useFormik } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";

export default ({ restoredValues, onSubmit }) => {
=======
import ProjectFilePicker from "components/ProjectFilePicker";
import { useFormik } from "formik";
import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as Yup from "yup";
import TagsInput from "components/TagsInput";

export default ({
  initialValues = { projectFile: null, title: "", description: "", tags: [] },
  onSubmit,
}) => {
>>>>>>> fdcd2e971e476652ee721a6a4efa6c9d3f0fc98a
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
<<<<<<< HEAD
    initialValues: restoredValues || {
      title: "",
      tags: [],
      description: "",
      projectFile: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is Required"),
      projectFile: restoredValues
        ? null
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
      {!restoredValues && (
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
      )}
=======
    initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is Required"),
      projectFile: Yup.object().required("Project File is required"),
    }),
    onSubmit,
  });

  return (
    <Form onSubmit={handleSubmit} noValidate className="mb-3 mt-3">
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
>>>>>>> fdcd2e971e476652ee721a6a4efa6c9d3f0fc98a
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
<<<<<<< HEAD
        <Form.Control
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.tags}
          name={"tags"}
          type="text"
          placeholder="Enter tags"
          isInvalid={touched.tags && !!errors.tags}
=======
        <TagsInput
          onchange={handleChange}
          onblur={handleBlur}
          values={values.tags}
          names="tags"
          types="text"
          placeholders="Enter tags"
          isInvalids={touched.tags && !!errors.tags}
>>>>>>> fdcd2e971e476652ee721a6a4efa6c9d3f0fc98a
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
