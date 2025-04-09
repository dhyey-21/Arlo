import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "../styles/ChatInterface.css";

const ChatInterface = ({ messages, isResponding, isListening }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const getMessageClass = (message) => {
    let classes = `message ${message.type}`;
    if (message.type === "assistant" && isResponding) {
      classes += " responding";
    }
    return classes;
  };

  return (
    <div className="chat-interface">
      <div className={`wave-container ${isListening ? 'active' : ''}`}>
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className="message-wrapper">
            <div className={getMessageClass(message)}>
              {message.text}
            </div>
          </div>
        ))}
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
};

ChatInterface.defaultProps = {
  isResponding: false,
  isListening: false,
};

export default ChatInterface;
