import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "../styles/ChatInterface.css";

const ChatInterface = ({ messages, isResponding, isListening, currentResponse, isTyping }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message-wrapper ${message.type}`}>
            <div className={`message ${message.type} ${message.type === 'assistant' && isResponding ? 'responding' : ''}`}>
              <div className="message-content">{message.text}</div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="message-wrapper assistant">
            <div className="message assistant responding">
              <div className="message-content">
                {currentResponse}
                <span className="typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

ChatInterface.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  isResponding: PropTypes.bool,
  isListening: PropTypes.bool,
  currentResponse: PropTypes.string,
  isTyping: PropTypes.bool
};

ChatInterface.defaultProps = {
  isResponding: false,
  isListening: false,
  currentResponse: "",
  isTyping: false
};

export default ChatInterface;
