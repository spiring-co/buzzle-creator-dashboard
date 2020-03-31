import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      <p>
        Welcome to pharaoh, the place to automate your templates with ease.{" "}
      </p>
      <br />
      <Link to="/login">Login</Link>
      <br />
      <Link to="/register">Register</Link>
    </div>
  );
}
export default Landing;
