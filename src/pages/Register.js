import { CountryList } from "components/CountryList";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
const config = { hostUrl: "http://pharaoh-api.herokuapp.com/creator" };
import { useFormik } from "formik";
import * as Yup from "yup";

const config = { hostUrl: "http://localhost:5000/creator" };
const countryCodeRegExp = /^(\+?\d{1,3}|\d{1,4})$/gm;
const phoneRegExp = /^\d{10}$/;
export default () => {
  const Background = styled.div`
  background-color:#dcdde1;
  height:150vh;
  width:100%:
  overflow-y: hidden;

  
    }
  `;

  const Form = styled.div`
    position: relative;
    background: white;
    left: 65vh;
    top: 40px;
    justify-content: center;
    width: 80vh;
    height: 120vh;
    border-radius: 20px 20px 20px 20px;
    padding: 25px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    @media (max-width: 768px) {
      left: 3vh;
      width: 90%;
      top: 8vh;
    }
  `;

  const [error, setError] = useState(null);
  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: {
      name: "sheeevam",
      email: "shivam.sasalol@yahoo.com",
      password: "password",
      countryCode: 101,
      phoneNumber: 8826245256,
      birthDate: "1999-02-12",
      country: "india",
      gender: "Male"
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is Required"),
      password: Yup.string().required("Password is Required"),
      name: Yup.string().required("Name is required"),
      countryCode: Yup.string()
        .matches(countryCodeRegExp, "country code is not valid")
        .required("country code is required"),
      phoneNumber: Yup.string()
        .matches(phoneRegExp, "phone number isn't valid")
        .required("Phone number is required"),
      birthDate: Yup.date().required("Birth date is required"),
      country: Yup.string().required("Country name is required"),
      gender: Yup.string().required("Gender field is required")
    }),
    onSubmit: async s => {
      fetch(config.hostUrl, {
        method: "POST",
        // mode: 'no-cors',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(s)
      })
        .then(response => {
          if (response.ok) {
            return window.location.assign("/");
          } else {
            response.json().then(e => setError(e));
          }
        })
        .catch(err => {
          setError(err);
          console.error("Error:", err);
        });
    }
  });

  return (
    <Background>
      <Form onSubmit={handleSubmit}>
        <p
          style={{
            marginTop: "0",
            fontSize: "25px",
            fontWeight: "bolder",

            marginBottom: "10px",
          }}
        >
          Register
        </p>

        <label style={{ float: "left", fontWeight: "bolder" }}>Name </label>
        <input
          style={{ backgroundColor: "#dcdde1", borderRadius: "10px" }}
          type="text"
          placeholder="Enter your name"
          name="creatorName"
        />
        <br />
        <label style={{ float: "left", fontWeight: "bolder" }}>Email </label>
        <input
          style={{ backgroundColor: "#dcdde1", borderRadius: "10px" }}
          type="text"
          placeholder="Enter your email"
          name="email"
        />
        <br />
        <label style={{ float: "left", fontWeight: "bolder" }}>Password </label>
        <input
          style={{ backgroundColor: "#dcdde1", borderRadius: "10px" }}
          type="password"
          placeholder="Enter password"
          name="password"
        />
        <br />
        <label style={{ float: "left", fontWeight: "bolder" }}>
          Country Code{" "}
        </label>
        <input

          style={{ backgroundColor: "#dcdde1", borderRadius: "10px" }}

          type="text"

          placeholder="Enter your country code number"
          name="countryCode"
          onChange={handleChange}
          value={values.countryCode}
        />
        {touched.countryCode && errors.countryCode ? (
          <p style={{ color: "red" }}>{errors.countryCode}</p>
        ) : null}
        <br />
        <label style={{ float: "left", fontWeight: "bolder" }}>
          Phone Number{" "}
        </label>
        <input

          style={{ backgroundColor: "#dcdde1", borderRadius: "10px" }}
          type="text"

          placeholder="Enter your phone number"
          name="phoneNumber"
          value={values.phoneNumber}
          onChange={handleChange}
        />
        {touched.phoneNumber && errors.phoneNumber ? (
          <p style={{ color: "red" }}>{errors.phoneNumber}</p>
        ) : null}
        <br />
        <label style={{ float: "left", fontWeight: "bolder" }}>
          Birth Date{" "}
        </label>
        <input

          style={{ backgroundColor: "#dcdde1", borderRadius: "10px" }}
          type="date"
          placeholder="Enter your birth date"
          name="birthDate"
          onChange={handleChange}
          value={values.birthDate}
        />
        {touched.birthDate && errors.birthDate ? (
          <p style={{ color: "red" }}>{errors.birthDate}</p>
        ) : null}
        {/* <input type="text" placeholder="Enter your Country" name="country" /> */}
        <br />
        <CountryList
          name="country"
          value={values.country}
          onChange={handleChange}
        />
        {touched.country && errors.country ? (
          <p style={{ color: "red" }}>{errors.country}</p>
        ) : null}
        <br />
        <label style={{ float: "left", fontWeight: "bolder" }}>Gender </label>
        <select
          style={{ backgroundColor: "#dcdde1", borderRadius: "10px" }}
          tyle={{ backgroundColor: "#dcdde1", borderRadius: "10px" }}
          id="gender"
          name="gender"
        >
          <option value="Male">male</option>
          <option value="Female">female</option>
          <option value="Other">other</option>
        </select>
        <br />

        <button
          style={{
            backgroundColor: "#0097e6",
            width: "12vh",
            marginTop: "35px",
          }}
          className="-bordered"
          type="submit"
        >
          Register
        </button>
        <p style={{ marginTop: "0" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#0097e6" }}>
            Log in
          </Link>
        </p>
      </Form>
    </Background>
  );
};
