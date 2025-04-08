import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ handleLogout }) => {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-left">
        <NavLink
          to="/home"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          aria-label="Home"
        >
          <i className="mdi mdi-home" aria-hidden="true"></i>
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          aria-label="History"
        >
          <i className="mdi mdi-history" aria-hidden="true"></i>
          <span>History</span>
        </NavLink>
      </div>

      <div className="navbar-brand">
        <NavLink to="/home" className="navbar-logo" aria-label="Arlo Home">
          <i className="mdi mdi-robot" aria-hidden="true"></i>
          <span>Arlo</span>
        </NavLink>
      </div>

      <div className="navbar-right">
        <button
          onClick={handleLogout}
          className="nav-link logout-btn"
          aria-label="Logout"
        >
          <i className="mdi mdi-logout" aria-hidden="true"></i>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
