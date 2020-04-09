import { CountryList } from "components/CountryList";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const config = { hostUrl: "http://localhost:5000/creator" };
const countryCodeRegExp = /^(\+?\d{1,3}|\d{1,4})$/gm;
const phoneRegExp = /^\d{10}$/;
const nameRegExp = /^[a-zA-Z ]+$/;

export default () => {
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
      gender: "Male",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is Required"),
      password: Yup.string().required("Password is Required"),
      name: Yup.string()
        .required("Name is required")
        .matches(nameRegExp, "name is invalid"),
      countryCode: Yup.string()
        .matches(countryCodeRegExp, "country code is not valid")
        .required("country code is required"),
      phoneNumber: Yup.string()
        .matches(phoneRegExp, "phone number isn't valid")
        .required("Phone number is required"),
      birthDate: Yup.date().required("Birth date is required"),
      country: Yup.string().required("Country name is required"),
      gender: Yup.string().required("Gender field is required"),
    }),
    onSubmit: async (s) => {
      try {
        const response = await fetch(config.hostUrl, {
          method: "POST",
          // mode: 'no-cors',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(s),
        });
        console.log(response);
        if (response.ok) {
          return window.location.assign("/");
        } else {
          const res = await response.json();
          console.log(res.message);
          let resSlice = res.message.slice(0, 6);
          if (resSlice == "E11000") {
            return setError({message:"the email is already used for registration"});
          }
          return setError(res.message);
        }
      } catch (err) {
        if (err.message === "Failed to fetch") {
          return setError({ message: "Something went wrong :(" });
        }
        setError(err);
        console.error("Error:", err);
      }
    },
  });

  return (
    <div>
      <p>
        Welcome to pharaoh please login to continue, if you don't have an
        account <Link to="/login">click here to login.</Link>
      </p>
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name </label>
        <input
          type="text"
          placeholder="Enter your name"
          name="name"
          onChange={handleChange}
          value={values.name}
        />
        {touched.name && errors.name ? (
          <p style={{ color: "red" }}>{errors.email}</p>
        ) : null}
        <br />
        <label>Email </label>
        <input
          type="text"
          placeholder="Enter your email"
          name="email"
          onChange={handleChange}
          value={values.email}
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
          onChange={handleChange}
          value={values.password}
        />
        {touched.password && errors.password ? (
          <p style={{ color: "red" }}>{errors.password}</p>
        ) : null}
        <br />
        <label>Country Code </label>
        <input
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
        <label>Phone Number </label>
        <input
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
        <label>Birth Date </label>
        <input
          type="Date"
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
        <label>Gender </label>
        <select
          id="gender"
          name="gender"
          onChange={handleChange}
          value={values.gender}
        >
          <option value="Male">male</option>
          <option value="Female">female</option>
          <option value="Other">other</option>
        </select>
        <br />

        <button className="-bordered" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};
