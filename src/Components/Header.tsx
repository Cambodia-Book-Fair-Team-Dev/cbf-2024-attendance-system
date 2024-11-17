// src/Components/Header.tsx
import React from "react";
import Navbar from "./Navbar";
import { useTheme } from "../ThemeContext";
import "../App.css"; // Ensure this import is present

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className={isDarkMode ? "dark" : ""}>
      <div className="logo" title="CBF2024 Management System">
        <img src="./cbflogo.png" alt="CBF Logo" />
        <h2 className="kantumruy-pro-title">ពិព័រណ៍សៀវភៅកម្ពុជាលើកទី១១</h2>
      </div>
      <div id="navbar-container">
        <Navbar />
      </div>
      <div className="theme-toggler" onClick={toggleTheme}>
        <span className={`material-icons-sharp ${!isDarkMode ? "active" : ""}`}>
          light_mode
        </span>
        <span className={`material-icons-sharp ${isDarkMode ? "active" : ""}`}>
          dark_mode
        </span>
      </div>
    </header>
  );
};

export default Header;
