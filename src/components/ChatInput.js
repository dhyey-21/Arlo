import React from "react";

const ChatInput = ({
  chatInput,
  setChatInput,
  speaking,
  handleKeyPress,
  isSupported,
  isListening,
  toggleListening,
  handleSendMessage,
}) => {
  return (
    <div className="chat-input-container">
      <textarea
        className="chat-input"
        placeholder="Type a message"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        rows={1}
        disabled={!speaking}
        onKeyPress={handleKeyPress}
      />
      {isSupported && (
        <button
          className="mic-button"
          onClick={toggleListening}
          disabled={!speaking}
        >
          {isListening ? (
            <span className="mic-icon recording">●</span>
          ) : (
            <span className="mic-icon">🎤</span>
          )}
        </button>
      )}
      {chatInput.trim() && (
        <button
          className="send-button"
          onClick={() => handleSendMessage(chatInput)}
          disabled={!speaking}
        >
          &#9658;
        </button>
      )}
    </div>
  );
};

export default ChatInput;
