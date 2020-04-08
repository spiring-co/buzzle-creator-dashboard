import { CountryList } from "components/CountryList";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
const config = { hostUrl: "http://pharaoh-api.herokuapp.com/creator" };

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

  const handleSubmit = (s) => {
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
      gender: elements["gender"].value,
    };
    sendDetails(d);
  };

  const sendDetails = async (data) => {
    fetch(config.hostUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        try {
          if (response.ok) {
            return window.location.assign("/");
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
          type="number"
          placeholder="Enter your country code number"
          name="countryCode"
        />
        <br />
        <label style={{ float: "left", fontWeight: "bolder" }}>
          Phone Number{" "}
        </label>
        <input
          style={{ backgroundColor: "#dcdde1", borderRadius: "10px" }}
          type="number"
          placeholder="Enter your phone number"
          name="phoneNumber"
        />
        <br />
        <label style={{ float: "left", fontWeight: "bolder" }}>
          Birth Date{" "}
        </label>
        <input
          style={{ backgroundColor: "#dcdde1", borderRadius: "10px" }}
          type="date"
          placeholder="Enter your birth date"
          name="birthDate"
        />
        {/* <input type="text" placeholder="Enter your Country" name="country" /> */}
        <br />
        <CountryList name="country" />
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
