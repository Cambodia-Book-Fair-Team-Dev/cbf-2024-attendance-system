import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Pages/Navbar.css";

const Navbar: React.FC = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
  navigate("/login");
  };
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
      <Link to="/login" className="nav-item" onClick={handleLogout}>
        <span className="material-icons-sharp">logout</span>
        <h3>Logout</h3>
      </Link>
    </div>
  );
};

export default Navbar;
