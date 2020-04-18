import { useFormik } from "formik";
import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuth from "services/auth";
import * as Yup from "yup";
import eyeof from "../components/eyeoff.svg";
import eye from "../components/eye.svg";
export default () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState("password");
  const [img, setImg] = useState("false");
  const { login } = useAuth();
  const handelpass = (event) => {
    event.preventDefault();
    setPass(pass === "password" ? "text" : "password");
    setImg(true);
  };
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      email: "shivam.sasalol@yahoo.com",
      password: "password",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Please enter a valid email address.")
        .required("Email is Required"),
      password: Yup.string().required("Password is Required"),
    }),
    onSubmit: async ({ email, password }) => {
      try {
        setLoading(true);
        await login(email, password);
        window.location = "/home"; // should we change getcreator in backend to search for isVeirified is true also
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <Form onSubmit={handleSubmit} noValidate className="mb-4 mt-5">
            <h3 className="text-center mb-4">Sign In</h3>
            <p className="text-muted text-center mb-4">
              Welcome back fam, what's cooking? 😎
            </p>
            {error && <Alert variant="danger" children={error.message} />}

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                name={"email"}
                type="email"
                placeholder="Enter email"
                isInvalid={touched.email && !!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Row>
                <Col>
                  <Form.Label className="d-block">Password</Form.Label>
                </Col>
                <Col className="text-right text-muted">
                  <Link to="/forgotPassword">Forgot Password</Link>
                </Col>
              </Row>
              <div style={{ display: "flex" }}>
                <Form.Control
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  name="password"
                  type={pass}
                  data-toggle="password"
                  placeholder="Password"
                  isInvalid={touched.password && !!errors.password}
                />
                <div
                  class="input-group-addon"
                  style={{
                    position: "relative",
                    right: "5vh",
                    marginTop: "5px",
                  }}
                >
                  <a
                    href=""
                    onClick={handelpass}
                    style={{ position: "relative" }}
                  >
                    {pass == "password" ? (
                      <img src={eye} />
                    ) : (
                      <img src={eyeof} />
                    )}
                  </a>
                </div>
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              block
              variant="primary"
              type="submit"
              children={loading ? "Loading..." : "Login"}
              disabled={loading}
            />
          </Form>
          <p className="text-muted text-center">
            Don't have an account yet? <Link to="/register">Sign up.</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};
