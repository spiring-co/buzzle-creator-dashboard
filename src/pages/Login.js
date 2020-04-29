import { useFormik } from "formik";
import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, BrowserRouter } from "react-router-dom";
import useAuth from "services/auth";
import * as Yup from "yup";
<<<<<<< HEAD
import eyeof from "../assets/eyeoff.svg";
import eye from "../assets/eye.svg";
=======
import { useTranslation } from "react-i18next";

>>>>>>> 67cb855796b5a687e93f7f49969fbffab2beb3d6
export default () => {
  const { t, i18n } = useTranslation();
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
        .email(t('enterEmail'))
        .required(t('required')),
      password: Yup.string().required(t('passwordRequired')),
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
                name="email"
                type="email"
                placeholder="Enter email"
                isInvalid={touched.email && !!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                {t('wontShareEmail')}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Row>
                <Col>
                  <Form.Label className="d-block">Password</Form.Label>
                </Col>
                <Col className="text-right text-muted">
                  <BrowserRouter>
                    <Link to="/forgotPassword">Forgot Password</Link>
                  </BrowserRouter>
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
                  className="input-group-addon"
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
            <BrowserRouter>
              Don't have an account yet? <Link to="/register">Sign up.</Link>
            </BrowserRouter>
          </p>
        </Col>
      </Row>
    </Container>
  );
};
