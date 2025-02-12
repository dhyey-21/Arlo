import React from "react";

const ChatInterface = ({ messages, speaking, isListening }) => {
  // Only show the most recent message pair (user + assistant or just user)
  const getRecentMessages = () => {
    const recent = messages.slice(-2);
    if (recent.length === 2 && recent[0].type === "assistant") {
      return recent.slice(-1);
    }
    return recent;
  };

  const recentMessages = getRecentMessages();

  return (
    <div className="subtitle-container">
      {recentMessages.map((message, index) => (
        <div
          key={index}
          className={`subtitle ${
            message.type === "user" ? "user-message" : "assistant-message"
          } ${speaking && message.type === "user" ? "fade-up" : ""}`}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default ChatInterface;
