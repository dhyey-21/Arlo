import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ handleLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="navbar-logo">
          <i className="mdi mdi-robot"></i>
          <span>Arlo</span>
        </NavLink>
      </div>
      <div className="navbar-links">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <i className="mdi mdi-home"></i>
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <i className="mdi mdi-history"></i>
          <span>History</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <i className="mdi mdi-cog"></i>
          <span>Settings</span>
        </NavLink>
        <button onClick={handleLogout} className="nav-link logout-btn">
          <i className="mdi mdi-logout"></i>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
