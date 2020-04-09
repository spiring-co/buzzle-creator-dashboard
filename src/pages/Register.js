import { CountryList } from "components/CountryList";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Yup from "yup";
const config = { hostUrl: "http://localhost:5000/creator" };
const countryCodeRegExp = /^(\+?\d{1,3}|\d{1,4})$/gm;
const phoneRegExp = /^\d{10}$/;
export default () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: {},
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is Required"),
      password: Yup.string().required("Password is Required"),
      countryCode: Yup.string()
        .matches(countryCodeRegExp, "country code is not valid")
        .required("country code is required"),
      phoneNumber: Yup.string()
        .matches(phoneRegExp, "Phone number isn't valid")
        .required("Phone number is required"),
      birthDate: Yup.date().required("Birth date is required"),
      country: Yup.string().required("Country name is required"),
      gender: Yup.string().required("Gender field is required"),
    }),
    onSubmit: async (s) => {
      try {
        setLoading(true);
        const response = await fetch(config.hostUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(s),
        });
        if (response.ok) {
          return window.location.assign("/");
        } else {
          setError(await response.json());
        }
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
        <Col md={6}>
          {error && <Alert variant="danger" children={error.message} />}
          <Form onSubmit={handleSubmit} className="mb-4 mt-5">
            <h3 className="text-center mb-3">Register</h3>
            <p className="text-muted text-center">
              You can register with your details and have the best time of your
              life. 🎉
            </p>
            {error && <Alert variant="danger" children={error.message} />}

            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                name={"name"}
                type="text"
                placeholder="Your name here"
                isInvalid={touched.name && !!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                name={"email"}
                type="email"
                placeholder="Your email here"
                isInvalid={touched.email && !!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                name={"password"}
                type="password"
                placeholder="Password"
                isInvalid={touched.password && !!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Your password should have at least 1 uppercase character.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="gender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.gender}
                name={"gender"}
                type="text"
                placeholder="Select gender"
                isInvalid={touched.gender && !!errors.gender}
                as="select"
                custom
              >
                <option disabled selected value="">
                  Select a gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.gender}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phoneNumber}
                name={"phoneNumber"}
                type="tel"
                placeholder="Enter Phone Number"
                isInvalid={touched.phoneNumber && !!errors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="birthDate">
              <Form.Label>Birth Date</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.birthDate}
                name={"birthDate"}
                type="date"
                placeholder="Enter Birth Date"
                isInvalid={touched.birthDate && !!errors.birthDate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.birthDate}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.country}
                name={"country"}
                placeholder="Select country"
                isInvalid={touched.country && !!errors.country}
                as="select"
                custom
              >
                <CountryList />
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.country}
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              block
              variant="primary"
              type="submit"
              children={loading ? "Loading..." : "Register"}
              disabled={loading}
            />
          </Form>
          <p className="text-muted text-center">
            Already registered? <Link to="/login">Sign In.</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};
