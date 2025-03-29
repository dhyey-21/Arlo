import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({
  handleLogout,
  handleConnect,
  handleDisconnect,
  isConnected,
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
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
      </div>

      <div className="navbar-brand">
        <NavLink to="/" className="navbar-logo">
          <i className="mdi mdi-robot"></i>
          <span>Arlo</span>
        </NavLink>
      </div>

      <div className="navbar-right">
        <button
          onClick={isConnected ? handleDisconnect : handleConnect}
          className={`nav-link connect-btn ${isConnected ? "connected" : ""}`}
        >
          <i
            className={`mdi ${
              isConnected ? "mdi-lan-disconnect" : "mdi-lan-connect"
            }`}
          ></i>
          <span>{isConnected ? "Disconnect" : "Connect"}</span>
        </button>
        <button onClick={handleLogout} className="nav-link logout-btn">
          <i className="mdi mdi-logout"></i>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
