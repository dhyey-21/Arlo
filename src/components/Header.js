import React from "react";

const Header = ({ speaking, setSpeaking, handleLogout }) => {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-text">Arlo</span>
      </div>
      <div className="header-buttons">
        <button
          className="connect-button"
          onClick={() => setSpeaking(!speaking)}
        >
          {speaking ? "Disconnect" : "Connect"}
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
