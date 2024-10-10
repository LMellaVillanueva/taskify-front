import React, { useEffect, useState } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MonitorIcon from "@mui/icons-material/Monitor";

const DarkMode = () => {
  const [darkMode, setDarkMode] = useState(
    // Si Theme es 'dark', darkMode será true
    localStorage.getItem("Theme") === "dark"
  );
  const [osTheme, setOsTheme] = useState(false);

  // darkMode manual
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("Theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("Theme", "light");
    }
  }, [darkMode]);

  // darkMode del sistema
  useEffect(() => {
    const systemTheme = localStorage.getItem("System");
    if (systemTheme === "True") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setDarkMode(true);
        document.body.classList.add("dark");
        localStorage.setItem("Theme", "dark");
      } else {
        setDarkMode(false);
        document.body.classList.remove("dark");
        localStorage.setItem("Theme", "light");
      }
    }
  }, [osTheme]);

  const handleMode = () => {
    // Al principio actualiza al estado en true
    setDarkMode(!darkMode);
    localStorage.setItem("System", "False");
    setOsTheme(false);
  };

  const handleSystem = () => {
    localStorage.setItem("System", "True");
    setOsTheme(true);
  };

  return (
    <React.Fragment>
      <main className="flex items-center gap-7">
        <button onClick={handleMode} className="border-none">
          {darkMode ? (
            <DarkModeIcon fontSize="large" className="animate-fade-left" />
          ) : (
            <LightModeIcon fontSize="large" className="animate-jump-in" />
          )}
        </button>
        <button onClick={handleSystem}>
          <MonitorIcon fontSize="large" className="animate-jump" />
        </button>
      </main>
    </React.Fragment>
  );
};
export default DarkMode;
