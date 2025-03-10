import React from "react";
import "../styles/Header.css";  

const Header = ({
  handleLogout,
  handleConnect,
  handleDisconnect,
  isConnected,
}) => {
  return (
    <header className="header">
      <h1 className="logo">
        <i className="mdi mdi-robot"></i> Arlo
      </h1>
      <div className="controls">
        <button
          className={`connect-btn ${isConnected ? "connected" : ""}`}
          onClick={isConnected ? handleDisconnect : handleConnect}
        >
          <i className={`mdi ${isConnected ? "mdi-lan-disconnect" : "mdi-lan-connect"}`}></i>
          {isConnected ? " Disconnect" : " Connect"}
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="mdi mdi-logout"></i> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
