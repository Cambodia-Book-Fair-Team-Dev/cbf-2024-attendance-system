import React from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Ensure this import is present

const Navbar: React.FC = () => {
  return (
    <div className="navbar">
      <Link to="/" className="nav-item">
        <span className="material-icons-sharp">home</span>
        <h3>Home</h3>
      </Link>
      <Link to="/scan" className="nav-item">
        <span className="material-symbols-outlined">qr_code_scanner</span>
        <h3>Scan</h3>
      </Link>
      <Link to="/dashboard" className="nav-item">
        <span className="material-symbols-outlined">dashboard</span>
        <h3>Dashboard</h3>
      </Link>
      <Link to="/volunteer" className="nav-item">
        <span className="material-symbols-outlined">groups</span>
        <h3>Volunteer</h3>
      </Link>
      <Link to="/logout" className="nav-item">
        <span className="material-icons-sharp">logout</span>
        <h3>Logout</h3>
      </Link>
    </div>
  );
};

export default Navbar;
