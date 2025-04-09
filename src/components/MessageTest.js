import React, { useState, useEffect, useRef } from 'react';
import '../styles/MainPage.css';
import '../styles/ChatInterface.css';

const MessageTest = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getMessageClass = (message, isTyping = false) => {
    let classes = `message ${message.type}`;
    if (message.type === 'assistant' && (isResponding || isTyping)) {
      classes += ' responding';
    }
    return classes;
  };

  const typeMessage = (text, callback) => {
    let index = 0;
    const words = text.split(' ');
    
    const typeWord = () => {
      if (index < words.length) {
        setCurrentText(prev => prev + (index === 0 ? '' : ' ') + words[index]);
        index++;
        setTimeout(typeWord, 150);
      } else {
        callback();
      }
    };
    
    typeWord();
  };

  const simulateMessage = () => {
    // Clear everything
    setMessages([]);
    setCurrentText('');
    setIsListening(false);
    setIsResponding(false);

    // Start listening with waves
    setIsListening(true);

    // After 2s, show user message and stop listening
    setTimeout(() => {
      setIsListening(false);
      setMessages([{
        type: 'user',
        text: 'This is a test user message'
      }]);

      // Start assistant response after 1s
      setTimeout(() => {
        // Start responding without waves first
        setIsResponding(true);
        setCurrentText('');
        
        // Type out assistant message word by word
        typeMessage('This is a test assistant response. It appears with wave and bubble animations.', () => {
          // When typing is done, add to messages
          setMessages(prev => [...prev, {
            type: 'assistant',
            text: 'This is a test assistant response. It appears with wave and bubble animations.'
          }]);
          setCurrentText('');
          
          // Start waves again after response
          setIsListening(true);
          
          // Stop everything after 2s
          setTimeout(() => {
            setIsListening(false);
            setIsResponding(false);
          }, 2000);
        });
      }, 1000);
    }, 2000);
  };

  return (
    <div className="main-page">
      <div className="chat-interface">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message-wrapper ${message.type}`}>
              <div className={getMessageClass(message)}>
                {message.text}
              </div>
            </div>
          ))}
          {currentText && (
            <div className="message-wrapper assistant">
              <div className={getMessageClass({ type: 'assistant' }, true)}>
                {currentText}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="test-controls" style={{ position: 'fixed', bottom: '100px', left: '20px', zIndex: 100 }}>
        <button onClick={simulateMessage} style={{ marginRight: '10px' }}>
          Simulate Message
        </button>
      </div>

      <div className={`wave-container ${isListening ? 'active' : ''}`}>
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      <div className={`electric-bubble ${isResponding && !isListening ? 'active' : ''}`}></div>
    </div>
  );
};

MessageTest.propTypes = {};

MessageTest.defaultProps = {};

export default MessageTest;
