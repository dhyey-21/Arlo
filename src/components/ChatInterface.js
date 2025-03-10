import React from "react";

const ChatInterface = ({ messages, speaking, isListening }) => {
  // Get only the most recent message pair
  const getRecentMessagePair = () => {
    const recentMessages = [];
    if (messages.length > 0) {
      // Get the last message
      const lastMessage = messages[messages.length - 1];
      // If it's an assistant message, show it with its corresponding user message
      if (lastMessage.type === "assistant" && messages.length > 1) {
        recentMessages.push(messages[messages.length - 2]); // User message
        recentMessages.push(lastMessage); // Assistant response
      } else {
        // If it's a user message, just show that
        recentMessages.push(lastMessage);
      }
    }
    return recentMessages;
  };

  const recentMessages = getRecentMessagePair();

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {recentMessages.map((message, index) => (
          <div key={index} className={`message-wrapper ${message.type}`}>
            <div
              className={`message ${
                message.type === "user" ? "user-message" : "assistant-message"
              } ${speaking && message.type === "user" ? "fade-up" : ""}`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatInterface;
