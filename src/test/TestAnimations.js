import React, { useState, useEffect } from "react";
import WaveAnimation from "../components/WaveAnimation";
import ElectricBubble from "../components/ElectricBubble";
import "../styles/MainPage.css";

const TestAnimations = () => {
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const simulateConversation = () => {
    // Reset
    setMessages([]);
    setCurrentResponse("");
    setIsTyping(false);
    
    // Step 1: Start listening
    setIsListening(true);
    setIsResponding(false);
    
    // Step 2: After 2 seconds, add user message and stop listening
    setTimeout(() => {
      // Only show user message, clearing any previous messages
      setMessages([{ 
        type: 'user', 
        text: 'What can you tell me about the weather today?' 
      }]);
      setIsListening(false);
      
      // Step 3: Start responding
      setTimeout(() => {
        setIsResponding(true);
        setIsTyping(true);
        
        // Step 4: Type out response letter by letter
        const fullResponse = "Today's weather is sunny with a high of 75°F. There's a slight breeze and no chance of rain. Perfect day to spend some time outside!";
        let index = 0;
        
        const typingInterval = setInterval(() => {
          if (index < fullResponse.length) {
            setCurrentResponse(prev => prev + fullResponse.charAt(index));
            index++;
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
            
            // Add the complete message to the messages array (keeping user message)
            setMessages(prev => [...prev, {
              type: 'assistant',
              text: fullResponse
            }]);
            
            // Step 5: Stop responding
            setTimeout(() => {
              setIsResponding(false);
            }, 1000);
          }
        }, 50); // Slowed down typing speed
      }, 1000);
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: "#14151a", height: "100vh", color: "white" }}>
      <h1 style={{ textAlign: "center", padding: "20px", margin: 0 }}>
        Animation Test Page
      </h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "40px" }}>
        <button 
          onClick={() => {
            setIsListening(true);
            setIsResponding(false);
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: isListening ? "#00ff9d" : "#333",
            color: isListening ? "#000" : "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Start Listening
        </button>
        
        <button 
          onClick={() => {
            setIsListening(false);
            setIsResponding(true);
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: isResponding ? "#00ff9d" : "#333",
            color: isResponding ? "#000" : "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Start Responding
        </button>
        
        <button 
          onClick={() => {
            setIsListening(false);
            setIsResponding(false);
            setMessages([]);
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Reset
        </button>
        
        <button 
          onClick={simulateConversation}
          style={{
            padding: "10px 20px",
            backgroundColor: "#00ff9d",
            color: "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Simulate Conversation
        </button>
      </div>

      {/* Wave animation component */}
      <WaveAnimation isActive={isListening} />
      
      {/* Electric bubble component */}
      <ElectricBubble isActive={isResponding} />

      {/* Status text indicators */}
      <div 
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          display: 'flex',
          gap: '1rem',
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
      </div>

      {/* Messages display */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((message, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
            width: '100%'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '12px',
              wordWrap: 'break-word',
              backgroundColor: message.type === 'user' ? '#e94560' : '#1a1a2e',
              color: 'white',
              boxShadow: message.type === 'user' 
                ? '0 4px 15px rgba(233, 69, 96, 0.2)' 
                : '0 4px 15px rgba(26, 26, 46, 0.3)',
              border: message.type === 'assistant' ? '1px solid rgba(0, 255, 157, 0.1)' : 'none',
              borderBottomRightRadius: message.type === 'user' ? 0 : '12px',
              borderBottomLeftRadius: message.type === 'assistant' ? 0 : '12px',
              position: 'relative',
              animation: message.type === 'assistant' && isResponding ? 'message-glow 1.5s infinite' : 'none'
            }}>
              {message.text}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            width: '100%'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '12px',
              wordWrap: 'break-word',
              backgroundColor: '#1a1a2e',
              color: 'white',
              boxShadow: '0 4px 15px rgba(26, 26, 46, 0.3)',
              border: '1px solid rgba(0, 255, 157, 0.1)',
              borderBottomLeftRadius: 0,
              position: 'relative',
              animation: 'message-glow 1.5s infinite'
            }}>
              {currentResponse}
              <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '8px' }}>
                <span style={{ 
                  display: 'inline-block', 
                  width: '6px', 
                  height: '6px', 
                  margin: '0 2px', 
                  backgroundColor: '#00ff9d', 
                  borderRadius: '50%', 
                  animation: 'typing-dot 1.4s infinite ease-in-out both',
                  animationDelay: '0s'
                }}></span>
                <span style={{ 
                  display: 'inline-block', 
                  width: '6px', 
                  height: '6px', 
                  margin: '0 2px', 
                  backgroundColor: '#00ff9d', 
                  borderRadius: '50%', 
                  animation: 'typing-dot 1.4s infinite ease-in-out both',
                  animationDelay: '0.2s'
                }}></span>
                <span style={{ 
                  display: 'inline-block', 
                  width: '6px', 
                  height: '6px', 
                  margin: '0 2px', 
                  backgroundColor: '#00ff9d', 
                  borderRadius: '50%', 
                  animation: 'typing-dot 1.4s infinite ease-in-out both',
                  animationDelay: '0.4s'
                }}></span>
              </span>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes message-glow {
            0% {
              box-shadow: 0 0 0 0 rgba(0, 255, 157, 0.2);
            }
            50% {
              box-shadow: 0 0 15px 5px rgba(0, 255, 157, 0.1);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(0, 255, 157, 0);
            }
          }
          
          @keyframes typing-dot {
            0%, 80%, 100% {
              transform: scale(0.6);
              opacity: 0.6;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(0, 255, 157, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(0, 255, 157, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(0, 255, 157, 0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default TestAnimations;
