import React, { useState, useEffect } from 'react';
import WaveAnimation from '../components/WaveAnimation';
import ElectricBubble from '../components/ElectricBubble';
import '../styles/MainPage.css';

const TestAnimations = () => {
  const [isListening, setIsListening] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Simulate a complete conversation cycle
  const simulateConversation = () => {
    // Reset states
    setIsListening(false);
    setIsResponding(false);
    setIsWaitingForResponse(false);
    setMessages([]);
    
    // 1. User starts speaking (wave animation)
    setIsListening(true);
    
    setTimeout(() => {
      // 2. User message received
      setIsListening(false);
      setIsWaitingForResponse(true);
      setMessages([{ type: 'user', text: 'What is the weather today?' }]);
      
      // 3. After 2 seconds, show processing state
      setTimeout(() => {
        setIsWaitingForResponse(true);
        setIsResponding(false);
        
        // 4. After 5 seconds, start assistant response
        setTimeout(() => {
          setIsWaitingForResponse(false);
          setIsResponding(true);
          simulateTyping("The weather today is sunny with a high of 75°F.");
        }, 5000);
      }, 2000);
    }, 2000);
  };

  const simulateTyping = (text) => {
    let index = 0;
    setCurrentMessage('');
    
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setCurrentMessage(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setMessages(prev => [...prev, { type: 'assistant', text }]);
        setIsResponding(false);
        setIsListening(true);
      }
    }, 50);
  };

  return (
    <div className="main-page">
      {/* Wave animation */}
      <WaveAnimation isActive={isListening} />
      
      {/* Electric bubble */}
      <ElectricBubble isActive={isResponding} />

      {/* Status indicators */}
      <div 
        style={{
          position: 'fixed',
          top: '40px',
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

      {/* Chat messages */}
      <div className="chat-container" style={{ marginTop: '80px' }}>
        <div style={{ padding: '20px' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: '10px',
                textAlign: msg.type === 'user' ? 'right' : 'left'
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '10px 15px',
                  borderRadius: '15px',
                  backgroundColor: msg.type === 'user' ? '#007AFF' : '#333',
                  color: 'white',
                  maxWidth: '70%'
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isResponding && (
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '10px 15px',
                  borderRadius: '15px',
                  backgroundColor: '#333',
                  color: 'white',
                  maxWidth: '70%'
                }}
              >
                {currentMessage}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Test controls */}
      <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <button 
          onClick={simulateConversation}
          style={{
            padding: '10px 20px',
            borderRadius: '20px',
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Test Conversation Flow
        </button>
      </div>
    </div>
  );
};

export default TestAnimations;
