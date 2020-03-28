import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "services/auth";

export default () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async s => {
    s.preventDefault();
    const { target: { elements } = {} } = s;

    try {
      setLoading(true);
      await login(elements["email"].value, elements["password"].value);
      window.location = "/home";
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>
          Welcome to <b>Pharaoh</b> please login to continue, if you don't have
          an account <Link to="/register">click here to register.</Link>
        </p>
        {loading && <p>Logging you in...</p>}
        <p style={{ color: "red" }}>{error?.message}</p>
        <div>
          <label>Email </label>
          <input type="text" placeholder="Enter email" name="email" />
          <br />
          <label>Password </label>
          <input type="password" placeholder="Enter password" name="password" />
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
