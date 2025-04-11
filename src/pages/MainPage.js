import React, { useState, useEffect, useRef } from "react";
import ChatInterface from "../components/ChatInterface";
import WaveAnimation from "../components/WaveAnimation";
import ElectricBubble from "../components/ElectricBubble";
import { websocketService } from "../services/websocketService";
import historyService from "../services/historyService";
import "../styles/MainPage.css";

const MainPage = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem('arloMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      { type: 'assistant', text: 'Hello! Say "HEY ARLO" to Start' }
    ];
  });
  const [isListening, setIsListening] = useState(() => {
    return sessionStorage.getItem('arloListening') === 'true';
  });
  const [isResponding, setIsResponding] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(() => {
    const savedConversation = sessionStorage.getItem('arloConversation');
    return savedConversation ? JSON.parse(savedConversation) : [];
  });
  const responseTimeoutRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const conversationIdRef = useRef(Date.now());
  const [connectionState, setConnectionState] = useState(() => {
    return localStorage.getItem('wsConnectionState') || 'disconnected';
  });

  // Clear session storage when component unmounts
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('arloMessages');
      sessionStorage.removeItem('arloListening');
      sessionStorage.removeItem('arloConversation');
    };
  }, []);

  // Clear messages when window is unloaded (refresh/close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('arloMessages');
      sessionStorage.removeItem('arloListening');
      sessionStorage.removeItem('arloConversation');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Handle connection state changes
  useEffect(() => {
    websocketService.setConnectionChangeHandler(setConnectionState);

    // Clear all states when disconnected
    const handleConnectionChange = (newState) => {
      if (newState !== 'connected') {
        // Clear all active states
        setIsListening(false);
        setIsResponding(false);
        setIsTyping(false);
        setIsWaitingForResponse(false);
        setCurrentResponse("");
        setMessages([]);
        setCurrentConversation([]);
        
        // Clear timeouts and intervals
        if (responseTimeoutRef.current) {
          clearTimeout(responseTimeoutRef.current);
        }
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
      }
    };

    // Initial connection state check
    handleConnectionChange(connectionState);
    return () => {
      websocketService.setConnectionChangeHandler(null);
    };
  }, []);

  // Save state to sessionStorage when it changes
  useEffect(() => {
    if (connectionState === 'connected') {
      sessionStorage.setItem('arloMessages', JSON.stringify(messages));
    }
  }, [messages, connectionState]);

  useEffect(() => {
    if (connectionState === 'connected') {
      sessionStorage.setItem('arloListening', isListening);
    }
  }, [isListening, connectionState]);

  useEffect(() => {
    if (connectionState === 'connected') {
      sessionStorage.setItem('arloConversation', JSON.stringify(currentConversation));
    }
  }, [currentConversation, connectionState]);

  // Set initial listening state when component mounts and connected
  useEffect(() => {
    if (connectionState === 'connected' && !isListening && !isResponding && !isWaitingForResponse) {
      setIsListening(true);
    }
  }, [connectionState]);

  useEffect(() => {
    const messageHandler = (data) => {
      console.log('Received WebSocket data:', data);
      
      // Only process messages when connected
      if (connectionState !== 'connected') return;

      // Handle status changes
      if (data.status) {
        console.log("Handling status:", data.status);
        const status = data.status.toLowerCase();
        switch (status) {
          case 'listening':
            setIsListening(true);
            setIsResponding(false);
            setIsWaitingForResponse(false);
            break;
          case 'responding':
            setIsListening(false);
            setIsResponding(false); // Don't show bubble until typing starts
            setIsWaitingForResponse(true);
            break;
          case 'idle':
            setIsListening(true); // Default to listening in idle state
            setIsResponding(false);
            setIsWaitingForResponse(false);
            break;
          default:
            console.log("Unknown status:", data.status);
        }
      }
      
      if (data.transcript !== undefined) {
        const userMessage = {
          type: 'user',
          text: data.transcript,
          sender: 'user',
          timestamp: new Date().toISOString(),
          conversationId: conversationIdRef.current
        };
        
        setMessages([userMessage]);
        setCurrentConversation([userMessage]);
        setIsWaitingForResponse(true);
        setIsResponding(false);
        setIsListening(false);
      }
      
      if (data.response !== undefined) {
        // Clear any existing timeouts/intervals
        if (responseTimeoutRef.current) {
          clearTimeout(responseTimeoutRef.current);
        }
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
        
        setCurrentResponse("");
        
        // Show loading indicator immediately when response is received
        setIsWaitingForResponse(true);
        setIsResponding(false);
        setIsListening(false);
        
        responseTimeoutRef.current = setTimeout(() => {
          // Start typing and show bubble animation
          setIsTyping(true);
          setIsResponding(true);
          setIsWaitingForResponse(false);
          setIsListening(false);
          
          const fullResponse = data.response;
          let currentText = fullResponse.charAt(0);
          setCurrentResponse(currentText);
          let index = 1;
          
          typingIntervalRef.current = setInterval(() => {
            if (index < fullResponse.length) {
              currentText += fullResponse.charAt(index);
              setCurrentResponse(currentText);
              index++;
            } else {
              clearInterval(typingIntervalRef.current);
              typingIntervalRef.current = null;
              setIsTyping(false);
              setIsWaitingForResponse(false);
              setIsResponding(false);
              setIsListening(true);
              
              const assistantMessage = {
                type: 'assistant',
                text: fullResponse,
                sender: 'assistant',
                timestamp: new Date().toISOString(),
                conversationId: conversationIdRef.current
              };
              
              setMessages(prev => [...prev, assistantMessage]);
              
              // Update conversation history without duplication
              setCurrentConversation(prev => {
                const newConversation = [...prev, assistantMessage];
                // Only save to history if this is a complete conversation
                if (prev.length === 1 && 
                    prev[0].type === 'user' && 
                    prev[0].conversationId === conversationIdRef.current) {
                  historyService.addConversation(newConversation);
                  // Generate new conversation ID for next conversation
                  conversationIdRef.current = Date.now();
                }
                return newConversation;
              });
            }
          }, 50);
        }, 2500);
      }
    };

    websocketService.setMessageHandler(messageHandler);

    return () => {
      websocketService.setMessageHandler(null);
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [connectionState]);

  return (
    <div className="main-page">
      {/* Connection status indicator */}
      {connectionState !== 'connected' && (
        <div 
          className="connection-indicator"
          style={{
            position: 'fixed',
            top: '80px',
            right: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '25px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            zIndex: 9999,
            animation: 'fade-in 0.3s ease-in-out'
          }}
        >
          <div className="status-dot" style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: connectionState === 'reconnecting' ? '#FFA500' : '#FF4444',
            animation: connectionState === 'reconnecting' ? 'pulse 1.5s infinite' : 'none'
          }}></div>
          <span style={{
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {connectionState === 'disconnected' ? 'Disconnected' : 
             connectionState === 'reconnecting' ? 'Reconnecting...' : 
             'Connection Error'}
          </span>
        </div>
      )}

      {/* Wave animation component */}
      {connectionState === 'connected' && (
        <WaveAnimation isActive={isListening} />
      )}
      
      {/* Electric bubble component */}
      {connectionState === 'connected' && (
        <ElectricBubble isActive={isResponding} />
      )}

      {/* Status text indicators */}
      <div 
        style={{
          position: 'fixed',
          top: '80px',
          right: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          zIndex: 998
        }}
      >
        {connectionState === 'connected' && isListening && (
          <div 
            style={{
              padding: '0.6rem 1.2rem',
              background: 'rgba(0, 0, 0, 0.7)',
              color: '#00ff9d',
              borderRadius: '20px',
              fontSize: '0.9rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 255, 157, 0.2)',
              boxShadow: '0 0 15px rgba(0, 255, 157, 0.1)',
              animation: 'pulse 1.5s infinite'
            }}
          >
            Listening...
          </div>
        )}
        {connectionState === 'connected' && isResponding && (
          <div 
            style={{
              padding: '0.6rem 1.2rem',
              background: 'rgba(0, 0, 0, 0.7)',
              color: '#00ff9d',
              borderRadius: '20px',
              fontSize: '0.9rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 255, 157, 0.2)',
              boxShadow: '0 0 15px rgba(0, 255, 157, 0.1)',
              animation: 'pulse 1.5s infinite'
            }}
          >
            Speaking...
          </div>
        )}
        {connectionState === 'connected' && isWaitingForResponse && !isResponding && (
          <div 
            style={{
              padding: '0.6rem 1.2rem',
              background: 'rgba(0, 0, 0, 0.7)',
              color: '#00ff9d',
              borderRadius: '20px',
              fontSize: '0.9rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 255, 157, 0.2)',
              boxShadow: '0 0 15px rgba(0, 255, 157, 0.1)',
              animation: 'pulse 1.5s infinite'
            }}
          >
            Processing...
          </div>
        )}
      </div>

      <div className="chat-container" style={{ marginTop: '80px' }}>
        {connectionState === 'connected' && (
          <ChatInterface 
            messages={messages}
            isListening={isListening}
            isResponding={isResponding}
            currentResponse={currentResponse}
            isTyping={isTyping}
            isWaitingForResponse={isWaitingForResponse}
          />
        )}
      </div>
    </div>
  );
};

export default MainPage;
