import React, { useState, useEffect, useRef } from "react";
import ChatInterface from "../components/ChatInterface";
import WaveAnimation from "../components/WaveAnimation";
import ElectricBubble from "../components/ElectricBubble";
import { websocketService } from "../services/websocketService";
import historyService from "../services/historyService";
import "../styles/MainPage.css";

const MainPage = () => {
  const [messages, setMessages] = useState([
    { type: 'assistant', text: 'Hello! Say "HEY ARLO" to Start' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [currentConversation, setCurrentConversation] = useState([]);
  const responseTimeoutRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Debug logging for state changes
  useEffect(() => {
    console.log("State changed - isListening:", isListening, "isResponding:", isResponding);
  }, [isListening, isResponding]);

  useEffect(() => {
    const messageHandler = (data) => {
      console.log('Received WebSocket data:', data);
      
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
          timestamp: new Date().toISOString()
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
                timestamp: new Date().toISOString()
              };
              
              setMessages(prev => [...prev, assistantMessage]);
              
              // Update conversation history without duplication
              setCurrentConversation(prev => {
                const newConversation = [...prev, assistantMessage];
                // Only save to history if it's a new conversation
                if (prev.length === 1 && prev[0].type === 'user') {
                  historyService.addConversation(newConversation);
                }
                return newConversation;
              });
            }
          }, 50);
        }, 5000);
      }
    };

    websocketService.setMessageHandler(messageHandler);

    return () => {
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="main-page">
      {/* Wave animation component */}
      <WaveAnimation isActive={isListening} />
      
      {/* Electric bubble component */}
      <ElectricBubble isActive={isResponding} />

      {/* Status text indicators */}
      <div 
        style={{
          position: 'fixed',
          top: '80px', 
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          zIndex: 998
        }}
      >
        {isListening && (
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
        {isResponding && (
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
        {isWaitingForResponse && !isResponding && (
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

      <div className="chat-container" style={{ marginTop: '80px' }}> {/* Increased margin to accommodate lowered status indicators */}
        <ChatInterface 
          messages={messages}
          isListening={isListening}
          isResponding={isResponding}
          currentResponse={currentResponse}
          isTyping={isTyping}
          isWaitingForResponse={isWaitingForResponse}
        />
      </div>
    </div>
  );
};

export default MainPage;
