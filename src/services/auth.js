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
  const [isAuthorized, setIsAuthorized] = useState(localStorage.getItem("jwtoken"))
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(false)

  useEffect(() => {
    if (isAuthorized && !user && !initializing) {
      //fetch user
      fetchUser()
    } else {
      setUser(null)
    }
  }, [isAuthorized])

  useEffect(() => {
    if (user) {
      const token = initNotificationService();
      // User.update(user.id, { pToken: token }).then(() => console.log("push token updated successfully!")).catch(e => console.log("Error updating push token, ", e?.message))
    }
  }, [user]);

  const fetchUser = async (mode = '') => {
    const jwt = localStorage.getItem("jwtoken");
    const { exp, id, name, email, role = "Creator", imageUrl, stripeCustomerId } = jwtDecode(
      jwt
    );
    try {
      mode !== 'refresh' && setInitializing(true)
      if (!(exp * 1000 > Date.now())) return null;
      setUser({ id, name, email, role, imageUrl, stripeCustomerId, ...await User.get(id) });
      mode !== 'refresh' && setInitializing(false)
    } catch (err) {
      mode !== 'refresh'? setUser({ id, name, email, role: 'Developer', imageUrl, stripeCustomerId }):
      setUser({...user,id, name, email, role: 'Developer', imageUrl, stripeCustomerId })
      mode !== 'refresh' && setInitializing(false)
    }
  };
  const refreshUser = async () => {
    await fetchUser('refresh')
  }

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
    setInitializing(true)
    const { token } = await response.json();
    localStorage.setItem("jwtoken", token)
    setIsAuthorized(true)
    return token;
  };

  const logout = async () => {
    localStorage.removeItem("jwtoken");
    setUser(null);
    setIsAuthorized(false)
    return true;
  };

  const sendOtp = async () => { };
  const value = useMemo(() => {
    return {
      login,
      isAuthorized,
      logout, initializing,
      sendOtp,
      user,refreshUser,
    };
  }, [login, logout, user, isAuthorized, initializing]);
  return <AuthContext.Provider value={value} {...props} />;
}

export { AuthProvider, useAuth };

