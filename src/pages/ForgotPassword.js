import { useFormik } from "formik";
import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import Confetti from "react-dom-confetti";
import { Link, BrowserRouter } from "react-router-dom";
import useAuth from "services/auth";
import * as Yup from "yup";

const config = {
  angle: 45,
  spread: 45,
  startVelocity: 45,
  elementCount: 50,
  dragFriction: 0.1,
  duration: 3000,
  stagger: 0,
  width: "10px",
  height: "10px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};
export default () => {
  const [error, setError] = useState(null);
  const [otpEmailSent, setOtpEmailSent] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Please enter a valid email address.")
        .required("Email is Required"),
    }),
    onSubmit: async ({ email, newPassword,otp }) => {
      otpEmailSent ? resetPassword(email, newPassword,otp) : sendPasswordResetOtp(email);
    },
  });

   const  resetPassword = async (email, newPassword, otp ) =>{
    try{
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/creator/resetPassword",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );
      console.log(await response.json());
      setPasswordResetSuccess(true)
    }
    catch(e){
      console.log(e)
      setError(e)
    }

  }

   const sendPasswordResetOtp = async (email) =>{
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/creator/resetPasswordEmail",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      console.log(await response.json());
      setOtpEmailSent(true)
    } catch (e) {
      console.log(e);
      setError(e);
    }
  }
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <Confetti active={passwordResetSuccess} config={config} />
          {passwordResetSuccess ? (
            <>
              <h3 className="text-center mb-4 mt-5">
                Password Reset Successfully!
              </h3>

              <p className="text-muted text-center mb-4">
                Wohoo, enjoy your brand new password and don't forget it. 🎉
              </p>
              <Confetti active={passwordResetSuccess} config={config} />
              <BrowserRouter>
                <Button
                  as={Link}
                  to="/login"
                  variant="primary"
                  children="Login"
                  block
                />
              </BrowserRouter>
            </>
          ) : (
            <>
              <Form onSubmit={handleSubmit} noValidate className="mb-4 mt-5">
                <h3 className="text-center mb-4">Forgot Password</h3>
                <p className="text-muted text-center mb-4">
                  No worries happens to all of us, we got you fam. 😌
                </p>
                {error && <Alert variant="danger" children={error.message} />}
                {otpEmailSent && (
                  <Alert variant="primary">
                    Please check your mail for an OTP we just sent!
                  </Alert>
                )}
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    disabled={otpEmailSent}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    name={"email"}
                    type="email"
                    readOnly={otpEmailSent}
                    plaintext={otpEmailSent}
                    placeholder="Enter email"
                    isInvalid={touched.email && !!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                {otpEmailSent && (
                  <>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>OTP</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.OTP}
                        name={"otp"}
                        type="otp"
                        placeholder="Enter otp"
                        isInvalid={touched.otp && !!errors.otp}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>{" "}
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        name={"password"}
                        type="password"
                        placeholder="Enter password"
                        isInvalid={touched.password && !!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}
                <Button
                  block
                  variant="primary"
                  type="submit"
                  children={
                    otpEmailSent
                      ? isSubmitting
                        ? "Resetting password..."
                        : "Reset"
                      : isSubmitting
                      ? "Sending OTP..."
                      : "Proceed"
                  }
                  disabled={isSubmitting}
                />
              </Form>
              <p className="text-muted text-center">
                Don't have an account yet?{" "}
                <BrowserRouter>
                  {" "}
                  <Link to="/register">Sign up.</Link>{" "}
                </BrowserRouter>
              </p>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};
