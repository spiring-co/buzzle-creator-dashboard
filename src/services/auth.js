import { useState } from "react";
import { useHistory } from "react-router-dom";
const baseUrl = process.env.REACT_APP_API_URL;
var jwtDecode = require('jwt-decode');
export default () => {
  const history = useHistory()
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
    const { token } = await response.json();
    localStorage.setItem("jwtoken", token);
    var user = jwtDecode(token)
    // set here decoded info 
    localStorage.setItem("creatorId", user.id);
    localStorage.setItem('email', user.email)
    setIsAuthenticated(true);
    return token;
  };

  const logout = async () => {
    localStorage.removeItem("jwtoken");
    history.push("/login")  // done this because isAuthenticated ,is not rendering in private route after setIsAuthenticated(false)
    setIsAuthenticated(false);
    return true;
  };

  return { login, logout, isAuthenticated };
};
