import React, { useEffect, useState } from "react";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const DarkMode = () => {
  const [darkMode, setDarkMode] = useState(
    // Si Theme es 'dark', darkMode será true
    localStorage.getItem("Theme") === "dark"
  );

  //Tema del OS
  // window.matchMedia("(prefers-color-scheme: dark)").matches
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("Theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("Theme", "light");
    }
  }, [darkMode]);

  const handleMode = () => {
    // Al principio actualiza al estado en true
    setDarkMode(!darkMode);
  };

  return (
    <React.Fragment>
      <button
        onClick={handleMode}
        className="border-none"
        >
          {darkMode ? <DarkModeIcon fontSize="large" className="animate-fade-left"/> : <LightModeIcon fontSize="large" className="animate-jump-in"/>}
      </button>
    </React.Fragment>
  );
};
export default DarkMode;
