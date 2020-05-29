import React, { useContext, useState, useEffect } from "react";
import { Button, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";


const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Lenght Too Short!")
    .max(80, "Length Too Long!")
    .required("Version title is required!"),
  description: Yup.string()
    .min(3, "Lenght Too Short!")
    .max(200, "Lenght Too Long!"),


})

export default ({ onSubmit, initialValue, onBack }) => {
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
  } = useFormik({
    initialValues: initialValue ? initialValue : {
      title: "",
      description: ""
    },
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit}
      style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center'
      }}>
      <TextField
        variant="outlined"
        name="title"
        value={values.title}
        onBlur={handleBlur}
        onChange={handleChange}
        error={touched.title && errors.title}
        helperText={touched.title && errors.title}
        type="text"
        margin="dense"
        placeholder="Enter Version Title"
        label="Version Title"
      />


      <TextField
        variant="outlined"
        name="description"
        value={values.description}
        onBlur={handleBlur}
        onChange={handleChange}
        error={touched.description && errors.description}
        helperText={touched.description && errors.description}
        type="text"
        multiline
        rows={3}
        margin="dense"
        placeholder="Enter Version Description"
        label="Version Description"
      />
      <div>
        <Button
          onClick={() => onBack()}
          size="small"
          style={{ width: 'fit-content', marginTop: 10 }}
          children="back"
        />
        <Button
          size="small"
          style={{ width: 'fit-content', marginTop: 10 }}
          color="primary"
          variant="contained"
          type="submit"
          children="Next"
        />
      </div>
    </form>
  );
};
