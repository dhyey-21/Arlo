import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ChatInterface from "../components/ChatInterface";
import ConnectionStatus from "../components/ConnectionStatus";
import { assistantService } from "../services/assistantService";
import "../styles/MainPage.css";

const MainPage = ({ setLoggedIn }) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef(null);

  // Toast configuration
  const toastConfig = {
    autoClose: 5000, // 5 seconds
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  };

  let toastId = null;
  const showToast = (message, type = 'info') => {
    if (toastId) {
      toast.dismiss(toastId);
    }
    toastId = toast[type](message, toastConfig);
  };

  useEffect(() => {
    let isInitialConnection = true;
    let retryTimeout = null;
    let isCleanedUp = false;

    const setupAssistant = async () => {
      if (isCleanedUp) return;
      try {
        setIsLoading(true);
        // Check initial connection
        const isHealthy = await assistantService.getStatus();
        setIsConnected(isHealthy);

        socketRef.current = assistantService.connect();

        socketRef.current.on("listening", () => {
          setIsListening(true);
          setIsResponding(false);
        });

        socketRef.current.on("connect", () => {
          setIsConnected(true);
          setIsLoading(false);
          setIsListening(true); // Start listening after connection
          setIsResponding(false);
          if (!isInitialConnection) {
            showToast('Reconnected to assistant', 'success');
          }
          isInitialConnection = false;
        });

        socketRef.current.on("disconnect", () => {
          setIsConnected(false);
          setIsListening(false);
          setIsResponding(false);
          setIsLoading(false);
          showToast('Disconnected from assistant. Attempting to reconnect...', 'warning');
        });

        socketRef.current.on("message", (message) => {
          setMessages(prev => [...prev, { type: 'user', text: message }]);
          // Keep the current state until response
        });

        socketRef.current.on("responding", () => {
          setIsListening(false);
          setIsResponding(true);
        });

        socketRef.current.on("response_complete", () => {
          setIsResponding(false);
          setIsListening(true); // Start listening again after response
        });

        socketRef.current.on("error", (error) => {
          if (isCleanedUp) return;
          setIsListening(false);
          setIsResponding(false);
          // Only show error toast if not already showing connection error
          if (!error.message?.includes('connect')) {
            showToast(error.message || 'Connection error. Please try again.', 'error');
          }
        });
      } catch (error) {
        if (isCleanedUp) return;
        setIsLoading(false);
        setIsConnected(false);
        showToast('Failed to connect to assistant. Retrying...', 'error');
        // Retry connection after 5 seconds
        if (retryTimeout) clearTimeout(retryTimeout);
        retryTimeout = setTimeout(() => {
          if (!isCleanedUp) setupAssistant();
        }, 5000);
      }
    };

    setupAssistant();

    return () => {
      isCleanedUp = true;
      if (retryTimeout) clearTimeout(retryTimeout);
      if (toastId) toast.dismiss(toastId);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.removeAllListeners();
      }
      if (assistantService && typeof assistantService.cleanup === 'function') {
        assistantService.cleanup();
      }
    };
  }, []);

  return (
    <div className="main-page">
      <nav className="nav-bar">
        <ConnectionStatus 
          isConnected={isConnected}
          isListening={isListening}
          isLoading={isLoading}
        />
      </nav>
      <div className="chat-container">
        <ChatInterface 
          messages={messages} 
          isResponding={isResponding}
        />
      </div>
      {isListening && (
        <div className={`wave-container ${isListening ? 'active' : ''}`}>
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>
      )}
      <div className={`electric-bubble ${isResponding && !isListening ? 'active' : ''}`}></div>
    </div>
  );
};

export default MainPage;
