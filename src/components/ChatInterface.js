import React from "react";
import Lottie from "react-lottie";

const ChatInterface = ({
  messages,
  chatContentRef,
  speaking,
  defaultOptions,
}) => {
  return (
    <div className="main-content">
      <div className="chat-section">
        <div className="chat-content" ref={chatContentRef}>
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.type}`}>
              <strong>{message.sender}:</strong> {message.text}
            </div>
          ))}
        </div>
      </div>

      {speaking && (
        <div className="audio-section">
          <Lottie options={defaultOptions} height={80} width={80} />
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
