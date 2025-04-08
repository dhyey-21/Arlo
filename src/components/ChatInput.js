import React from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import "../styles/ChatInput.css";

const ChatInput = ({
  speaking,
  isSupported,
  isListening,
  toggleListening,
  isConnected
}) => {
  return (
    <div className="chat-input-container">
      <button
        onClick={toggleListening}
        disabled={!isConnected || speaking}
        className={`mic-button ${isListening ? "active" : ""} ${
          !isConnected ? "disabled" : ""
        }`}
      >
        {isListening ? <FaMicrophone /> : <FaMicrophoneSlash />}
      </button>
    </div>
  );
};

export default ChatInput;
