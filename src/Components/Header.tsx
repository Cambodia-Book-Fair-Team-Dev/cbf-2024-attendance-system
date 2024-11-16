import React from 'react';
import Navbar from './Navbar';
import '../App.css'; // Ensure this import is present

const Header: React.FC = () => {
  return (
    <header>
      <div className="logo" title="CBF2024 Management System">
        <img src="./cbflogo.png" alt="CBF Logo" />
        <h2 className="kantumruy-pro-title">ពិព័រណ៍សៀវភៅកម្ពុជាលើកទី១១</h2>
      </div>
      <div id="navbar-container">
        <Navbar />
      </div>
      <div id="profile-btn">
        <span className="material-icons-sharp">person</span>
      </div>
      <div className="theme-toggler">
        <span className="material-icons-sharp active">light_mode</span>
        <span className="material-icons-sharp">dark_mode</span>
      </div>
    </header>
  );
};

export default Header;