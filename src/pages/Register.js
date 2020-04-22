import { CountryList } from "components/CountryList";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, BrowserRouter } from "react-router-dom";
import * as Yup from "yup";

export default () => {
  const [error, setError] = useState(null);
  const submition = async (s) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/creator", {
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
        const res = await response.json();
        console.log(res.message);
        let resSlice = res.message.slice(0, 6);
        if (resSlice == "E11000") {
          return setError({
            message: "the email is already used for registration",
          });
        }
        return setError(res.message);
      }
    } catch (e) {
      setError(e);
    }
  };

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      countryCode: "",
      password: "",
      gender: "",
      country: "",
      phoneNumber: "",
      birthDate: "",
    },
    validationSchema,
    onSubmit: submition,
  });
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form
            isValidated={Object.keys(errors).length}
            onSubmit={handleSubmit}
            className="mb-4 mt-5"
          >
            <h3 className="text-center mb-4">Register</h3>
            <p className="text-muted text-center mb-4">
              You can register with your details and have the best time of your
              life. 🎉
            </p>
            {error && (
              <Alert
                variant="danger"
                children={error.message || "Something went wrong 😕"}
              />
            )}

            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name={"name"}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Your name here"
                isValid={touched.name && !errors.name}
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
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
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
            <Form.Group controlId="countryCode">
              <Form.Label>Country Code</Form.Label>
              <Form.Control
                name={"countryCode"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.countryCode}
                type="tel"
                placeholder="Enter Country Code"
                isInvalid={touched.countryCode && !!errors.countryCode}
              />
              <Form.Control.Feedback type="invalid">
                {errors.countryCode}
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
              children={isSubmitting ? "Loading..." : "Register"}
              disabled={isSubmitting}
            />
          </Form>
          <p className="text-muted text-center">
            Already registered?
            <BrowserRouter>
              {" "}
              <Link to="/login">Sign In.</Link>{" "}
            </BrowserRouter>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Should be at least 3 characters")
    .max(40, "Should not be more than 40 characters")
    .matches(/^[a-zA-Z ]*$/, "Should only contain alphabetic characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .max(100, "Should not be more than 100 characters")
    .required("Email is Required"),
  password: Yup.string()
    .min(8, "Should be at least 8 characters")
    .max(40, "Should not be more than 40 characters")
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,40}$/,
      "Should have  at least a number, and at least a special character"
    )
    .required("Password is Required"),
  countryCode: Yup.string()
    .matches(/^(\+?\d{1,3}|\d{1,4})$/gm, "Country code is not valid")
    .required("Country code is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number isn't valid")
    .required("Phone number is required"),

  //TODO age check
  birthDate: Yup.date().required("Birth date is required"),
  country: Yup.string().required("Country name is required"),
  gender: Yup.string().required("Gender field is required"),
});
