import { useFormik } from "formik";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "services/auth";
import * as Yup from "yup";
import styled from "styled-components";
import { Container } from "react-bootstrap";
export default () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState("password");
  const { login } = useAuth();

  const handlePassword = (e) => {
    setPass(pass == "password" ? "text" : "password");
  };

  const Background = styled.div`
  background-color:#dcdde1;
  height:100vh;
  width:100%:
  overflow-y: hidden;

  
    }
  `;

  const Form = styled.form`
    position: relative;
    background: white;
    left: 80vh;
    top: 100px;
    justify-content: center;
    width: 50vh;
    height: 50vh;
    border-radius: 20px 20px 20px 20px;
    padding: 25px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    @media (max-width: 768px) {
      left: 10vh;
      width: 60%;
      top: 20vh;
    }
  `;

  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: {
      email: "shivam.sasalol@yahoo.com",
      password: "password",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is Required"),
      password: Yup.string().required("Password is Required"),
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
    },
  });

  if (loading) {
    return <p>Logging you in...</p>;
  }

  return (
    <Background>
      {error && <p style={{ color: "red" }}>Error: {error?.message}</p>}
      <Form onSubmit={handleSubmit}>
        <p style={{ fontSize: "25px", fontWeight: "bolder" }}>Log In</p>
        <p style={{ marginTop: "0", fontSize: "15px", color: "grey" }}>
          To access your Dashboard
        </p>
        <label style={{ float: "left", fontWeight: "bolder" }}>Email </label>
        <input
          style={{ backgroundColor: "#dcdde1", borderRadius: "10px" }}
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
        <label style={{ float: "left", fontWeight: "bolder" }}>Password </label>
        <p
          style={{
            marginTop: "11px",
            fontSize: "15px",
            color: "grey",
            float: "right",
          }}
        >
          Forgot password?
        </p>
        <input
          style={{ backgroundColor: "#dcdde1", borderRadius: "10px" }}
          type={pass}
          placeholder="Enter password"
          name="password"
          value={values.password}
          onChange={handleChange}
        />

        <input
          style={{
            marginTop: "0",
            float: "right",
            position: "relative",
            bottom: "40px",
            right: "20px",
          }}
          type="checkbox"
          onChange={handlePassword}
        />

        {touched.password && errors.password ? (
          <p style={{ color: "red" }}>{errors.password}</p>
        ) : null}
        <br />
        <button
          style={{
            backgroundColor: "#0097e6",
            width: "10vh",
            marginTop: "25px",
          }}
          type="submit"
        >
          Login
        </button>
        <p style={{ marginTop: "4px" }}>Don't have an account?</p>
        <Link to="/register" style={{ color: "#0097e6" }}>
          {" "}
          Register
        </Link>
      </Form>
    </Background>
  );
};
