import React, { useState, useMemo, createContext, useContext } from "react";
const jwtDecode = require("jwt-decode");
const AuthContext = createContext();

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    console.log("useAuth must be used within a AuthProvider");
  }
  return context;
}

function AuthProvider(props) {
  const getUser = () => {
    const jwt = localStorage.getItem("jwtoken");
    if (!jwt) return null;

    try {
      const { exp, id, name, email } = jwtDecode(jwt);
      console.log(exp);
      if (!(exp * 1000 > Date.now())) return null;
      return { id, name, email };
    } catch (err) {
      return null;
    }
  };
  const [user, setUser] = useState(getUser());

  const login = async (email, password) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    const { token } = await response.json();
    localStorage.setItem("jwtoken", token);

    try {
      const { id, name, email } = jwtDecode(token);
      setUser({ id, name, email });
    } catch (err) {
      setUser(null);
      console.log(err);
    }
    return token;
  };

  const logout = async () => {
    localStorage.removeItem("jwtoken");
    setUser(null);
    return true;
  };

  const value = useMemo(() => {
    return {
      login,
      logout,
      user,
    };
  }, [login, logout, user]);
  return <AuthContext.Provider value={value} {...props} />;
}

export { AuthProvider, useAuth };
