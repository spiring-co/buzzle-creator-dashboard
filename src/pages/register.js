import { CountryList } from "components/CountryList";
import React from "react";
import { Link } from "react-router-dom";

const config = { hostUrl: "http://pharaoh-api.herokuapp.com/creator" };

export default () => {
  const handleSubmit = s => {
    s.preventDefault();

    // if (!s.target.value) {
    //   console.log("empty input");
    //   return false;
    // }

    const { target: { elements } = {} } = s;

    console.log(elements);

    const d = {
      name: elements["creatorName"].value,
      email: elements["email"].value,
      password: elements["password"].value,
      countryCode: elements["countryCode"].value,
      phoneNumber: elements["phoneNumber"].value,
      birthDate: elements["birthDate"].value,
      country: elements["country"].value,
      gender: elements["gender"].value
    };
    sendDetails(d);
  };

  const sendDetails = async data => {
    fetch(config.hostUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          return window.location.assign("/");
        }
        throw new Error({ message: response.text() });
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <p>
        Welcome to pharaoh please login to continue, if you don't have an
        account <Link to="/login">click here to login.</Link>
      </p>
      <form onSubmit={handleSubmit}>
        <label>Name </label>
        <input type="text" placeholder="Enter your name" name="creatorName" />
        <br />
        <label>Email </label>
        <input type="text" placeholder="Enter your email" name="email" />
        <br />
        <label>Password </label>
        <input type="password" placeholder="Enter password" name="password" />
        <br />
        <label>Country Code </label>
        <input
          type="number"
          placeholder="Enter your country code number"
          name="countryCode"
        />
        <br />
        <label>Phone Number </label>
        <input
          type="number"
          placeholder="Enter your phone number"
          name="phoneNumber"
        />
        <br />
        <label>Birth Date </label>
        <input
          type="date"
          placeholder="Enter your birth date"
          name="birthDate"
        />
        {/* <input type="text" placeholder="Enter your Country" name="country" /> */}
        <br />
        <CountryList name="country" />
        <br />
        <label>Gender </label>
        <select id="gender" name="gender">
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
