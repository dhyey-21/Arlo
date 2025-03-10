import React, { useState } from "react";
import "../styles/Settings.css";

const Settings = () => {
  const [settings, setSettings] = useState({
    voiceSpeed: 1,
    voicePitch: 1,
    autoConnect: false,
    darkMode: true,
    notifications: true,
    language: "en-US",
  });

  const handleChange = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      <div className="settings-section">
        <h2>Voice Settings</h2>
        <div className="setting-item">
          <label>Voice Speed</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.voiceSpeed}
            onChange={(e) =>
              handleChange("voiceSpeed", parseFloat(e.target.value))
            }
          />
          <span>{settings.voiceSpeed}x</span>
        </div>

        <div className="setting-item">
          <label>Voice Pitch</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.voicePitch}
            onChange={(e) =>
              handleChange("voicePitch", parseFloat(e.target.value))
            }
          />
          <span>{settings.voicePitch}x</span>
        </div>

        <div className="setting-item">
          <label>Language</label>
          <select
            value={settings.language}
            onChange={(e) => handleChange("language", e.target.value)}
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2>General Settings</h2>
        <div className="setting-item">
          <label>Auto-connect on startup</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.autoConnect}
              onChange={(e) => handleChange("autoConnect", e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <label>Dark Mode</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => handleChange("darkMode", e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <label>Notifications</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleChange("notifications", e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
