import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ChatInterface from "../components/ChatInterface";
import { useWebSocket } from "../hooks/useWebSocket";
import "../styles/MainPage.css";

const MainPage = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { connect, disconnect } = useWebSocket({
    onMessage: (message) => {
      if (message.type === "transcript") {
        setMessages((prev) => [...prev, { type: "user", text: message.text }]);
        setIsLoading(true);
      } else if (message.type === "response") {
        setMessages((prev) => [
          ...prev,
          { type: "assistant", text: message.text },
        ]);
        setIsLoading(false);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Connection error occurred");
      setIsLoading(false);
    },
  });

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <div className="main-page">
      <ChatInterface messages={messages} isLoading={isLoading} />
    </div>
  );
};

export default MainPage;
