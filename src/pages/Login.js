import { useFormik } from "formik";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "services/auth";
import * as Yup from "yup";

export default () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: {
      email: "shivam.sasalol@yahoo.com",
      password: "password"
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is Required"),
      password: Yup.string().required("Password is Required")
    }),
    onSubmit: async ({ email, password }) => {
      try {
        setLoading(true);
        await login(email, password);
        window.location = "/home";
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>
          Welcome to <b>Pharaoh</b> please login to continue, if you don't have
          an account <Link to="/register">click here to register.</Link>
        </p>
        {loading && <p>Logging you in...</p>}
        {error && <p style={{ color: "red" }}>Error: {error?.message}</p>}
        <div>
          <label>Email </label>
          <input
            type="text"
            placeholder="Enter email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
          {touched.email && errors.email ? (
            <p style={{ color: "red" }}>{errors.email}</p>
          ) : null}
          <br />
          <label>Password </label>
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
          {touched.password && errors.password ? (
            <p style={{ color: "red" }}>{errors.password}</p>
          ) : null}
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};