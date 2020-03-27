import React, { useState } from "react";
import { login } from "services/auth";
import { useHistory } from "react-router-dom";
export default () => {
  let history = useHistory();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async s => {
    s.preventDefault();
    const { target: { elements } = {} } = s;

    try {
      setLoading(true);
      login(elements["email"].value, elements["password"].value);
      history.push("/home");
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {loading && <p>Logging you in...</p>}
        <p style={{ color: "red" }}>{error?.message}</p>
        <div>
          <input type="text" placeholder="Enter email" name="email" />
          <input type="password" placeholder="Enter password" name="password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
