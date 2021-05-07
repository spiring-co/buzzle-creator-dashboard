import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  useEffect,
} from "react";
import { User } from "./api";
import { initNotificationService } from "./notifications";
const jwtDecode = require("jwt-decode");
const AuthContext = createContext();

const { REACT_APP_API_URL } = process.env;

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
      const { exp, id, name, email, role = "Creator", imageUrl } = jwtDecode(
        jwt
      );
      console.log(exp);
      if (!(exp * 1000 > Date.now())) return null;
     //TODO
      return { id, name, email, role:"Creator", imageUrl };
    } catch (err) {
      return null;
    }
  };
  const [user, setUser] = useState(getUser());
  useEffect(() => {
    if (user) {
      const token = initNotificationService();
      console.log(user);
      // User.update(user.id, { pToken: token }).then(() => console.log("push token updated successfully!")).catch(e => console.log("Error updating push token, ", e?.message))
    }
  }, [user]);

  const login = async (email, password, role = "Creator") => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      }
    );
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    const { token } = await response.json();
    localStorage.setItem("jwtoken", token);

    try {
      const { id, name, email, role = "" } = jwtDecode(token);
      console.log("role is" + role);
      setUser({ id, name, email, role: "Creator" });
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

  const sendOtp = async () => { };
  const value = useMemo(() => {
    return {
      login,
      logout,
      sendOtp,
      user,
    };
  }, [login, logout, user]);
  return <AuthContext.Provider value={value} {...props} />;
}

export { AuthProvider, useAuth };
