import React, { useState, useEffect, createContext, useContext } from "react";

const DarkModeContext = createContext();

const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    console.log("useAuth must be used within a DarkModeProvider");
  }
  return context;
};

function DarkModeProvider(props) {
  const [theme, setTheme] = useState("light");
  const [componentMounted, setComponentMounted] = useState(false);
  const setMode = (mode) => {
    window.localStorage.setItem("theme", mode);
    setTheme(mode);
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches &&
    !localTheme
      ? setMode("dark")
      : localTheme
      ? setTheme(localTheme)
      : setMode("light");
    setComponentMounted(true);
  }, []);

  return (
    <DarkModeContext.Provider
      value={[theme, toggleTheme, componentMounted]}
      {...props}
    />
  );
}

export { DarkModeProvider, useDarkMode };
