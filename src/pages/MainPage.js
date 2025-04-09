import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import ChatInterface from "../components/ChatInterface";
import ConnectionStatus from "../components/ConnectionStatus";
import { assistantService } from "../services/assistantService";
import { websocketService } from "../services/websocketService";
import "../styles/MainPage.css";

const MainPage = ({ setLoggedIn }) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const lastToastId = useRef(null);
  const lastConnectionState = useRef(false);

  const showToast = useCallback((message, type = 'info') => {
    // Dismiss previous toast if it exists
    if (lastToastId.current) {
      toast.dismiss(lastToastId.current);
    }
    lastToastId.current = toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);

  useEffect(() => {
    let healthCheckInterval;
    let isCleanedUp = false;

    const setupConnection = async () => {
      if (isCleanedUp) return;
      
      try {
        // Initial health check
        const isHealthy = await assistantService.getStatus();
        if (!isHealthy) {
          setIsConnected(false);
          showToast('Unable to connect to server', 'error');
          return;
        }

        // Setup WebSocket
        websocketService.addConnectionListener((connected) => {
          setIsConnected(connected);
          setIsLoading(false);
          
          // Only show connection status toast if state has changed
          if (connected !== lastConnectionState.current) {
            lastConnectionState.current = connected;
            if (connected) {
              showToast('Connected to server', 'success');
              setIsListening(true); // Start listening when connected
            } else {
              showToast('Disconnected from server', 'warning');
              setIsListening(false); // Stop listening when disconnected
            }
          }
        });

        // Setup message handlers
        websocketService.addMessageHandler('listening', () => {
          setIsListening(true);
          setIsResponding(false);
        });

        websocketService.addMessageHandler('responding', () => {
          setIsListening(false);
          setIsResponding(true);
        });

        websocketService.addMessageHandler('response_complete', () => {
          setIsResponding(false);
          setIsListening(true);
        });

        // Connect WebSocket
        websocketService.connect();

        // Setup periodic health checks (every 10 seconds)
        healthCheckInterval = setInterval(async () => {
          if (isCleanedUp) return;
          try {
            const isHealthy = await assistantService.getStatus();
            if (!isHealthy && isConnected) {
              setIsConnected(false);
              setIsListening(false);
              // Only show disconnection toast if state has changed
              if (lastConnectionState.current) {
                lastConnectionState.current = false;
                showToast('Lost connection to server', 'error');
              }
            }
          } catch (error) {
            console.error('Health check failed:', error);
          }
        }, 10000);

      } catch (error) {
        console.error('Setup failed:', error);
        setIsConnected(false);
        setIsLoading(false);
        setIsListening(false);
        showToast('Failed to connect to server', 'error');
      }
    };

    setupConnection();

    return () => {
      isCleanedUp = true;
      if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
      }
      if (lastToastId.current) {
        toast.dismiss(lastToastId.current);
      }
      websocketService.disconnect();
    };
  }, [showToast]);

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
          isListening={isListening}
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
