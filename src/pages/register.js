import React from "react";

import { CountryList } from "./CountryList.jsx";

const config = { hostUrl: "http://pharaoh-api.herokuapp.com/creator" };

export default () => {
  let ResIsOk = {};

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
        try{
        if (response.ok) {
          return window.location.assign("/login");
        }
      }
      catch(error){
        console.log(error)
      }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <h1> register please</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter your name" name="creatorName" />
        <input type="text" placeholder="Enter your email" name="email" />
        <input type="password" placeholder="Enter password" name="password" />
        <input
          type="number"
          placeholder="Enter your country code number"
          name="countryCode"
        />
        <input
          type="number"
          placeholder="Enter your phone number"
          name="phoneNumber"
        />
        <input
          type="date"
          placeholder="Enter your birth date"
          name="birthDate"
        />
        {/* <input type="text" placeholder="Enter your Country" name="country" /> */}
        <CountryList name="country" />
        <label for="gender">Choose your gender:</label>
        <select id="gender" name="gender">
          <option value="Male">male</option>
          <option value="Female">female</option>
          <option value="Other">other</option>
        </select>
        <button type="submit">register</button>
      </form>
    </div>
  );
};