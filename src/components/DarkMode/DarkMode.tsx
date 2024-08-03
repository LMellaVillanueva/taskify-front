import React, { useEffect, useState } from "react";

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
        className="bg-slate-600 p-2 rounded-xl text-white m-2">
        Dark Mode
      </button>
    </React.Fragment>
  );
};
export default DarkMode;
