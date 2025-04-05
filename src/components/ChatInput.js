import React from "react";
import "../styles/ChatInput.css";

const ChatInput = ({
  speaking,
  isSupported,
  isListening,
  toggleListening,
  isConnected,
}) => {
  return (
    <div className="chat-input-container">
      {isSupported && (
        <button
          onClick={toggleListening}
          disabled={!isConnected || speaking}
          className={`mic-button ${isListening ? "active" : ""} ${
            !isConnected ? "disabled" : ""
          }`}
        >
          <i className={`mdi ${isListening ? 'mdi-microphone' : 'mdi-microphone-off'}`}></i>
        </button>
      )}
    </div>
  );
};

export default ChatInput;
