import { useState } from "react";

const baseUrl = process.env.REACT_APP_API_URL;

export default () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("jwtoken") !== null
  );

  const login = async (email, password) => {
    const response = await fetch(baseUrl + "/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error((await response.json()).message); //Help
      //      throw new Error("password is incorrect");
    }
    const { jwtoken, creatorDetails } = await response.json();
    localStorage.setItem("jwtoken", jwtoken[0]);
    localStorage.setItem("creatorDetails", creatorDetails[0]);
    setIsAuthenticated(true);
    return jwtoken;
  };

  const logout = async () => {
    localStorage.removeItem("jwtoken");
    window.location = "/login"  // done this because isAuthenticated ,is not rendering in private route after setIsAuthenticated(false)
    setIsAuthenticated(false);
    return true;
  };

  return { login, logout, isAuthenticated };
};
