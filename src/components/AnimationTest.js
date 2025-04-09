import React, { useState, useEffect } from 'react';
import ConnectionStatus from './ConnectionStatus';

const AnimationTest = () => {
  const [state, setState] = useState({
    isConnected: false,
    isListening: false,
    isLoading: false
  });

  // Cycle through different states
  useEffect(() => {
    const states = [
      { isConnected: false, isListening: false, isLoading: true },  // Loading
      { isConnected: true, isListening: false, isLoading: false },  // Connected
      { isConnected: true, isListening: true, isLoading: false },   // Listening
      { isConnected: false, isListening: false, isLoading: false }, // Disconnected
    ];

    let currentIndex = 0;

    const interval = setInterval(() => {
      setState(states[currentIndex]);
      currentIndex = (currentIndex + 1) % states.length;
    }, 2000); // Change state every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Animation Test</h2>
      <ConnectionStatus 
        isConnected={state.isConnected}
        isListening={state.isListening}
        isLoading={state.isLoading}
      />
      <div style={{ marginTop: '20px' }}>
        <h3>Current State:</h3>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    </div>
  );
};

export default AnimationTest;
