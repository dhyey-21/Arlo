import React, { useState } from 'react';
import '../styles/MainPage.css';

const AnimationEffectsTest = () => {
  const [showWave, setShowWave] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  return (
    <div className="main-page" style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setShowWave(!showWave)}
          style={{ marginRight: '10px' }}
        >
          Toggle Wave
        </button>
        <button 
          onClick={() => setShowBubble(!showBubble)}
        >
          Toggle Bubble
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Current State:</h3>
        <div>Wave: {showWave ? 'Visible' : 'Hidden'}</div>
        <div>Bubble: {showBubble ? 'Visible' : 'Hidden'}</div>
      </div>

      {showWave && (
        <div className="wave-container active">
          <div className="wave"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>
      )}
      
      {showBubble && (
        <div className="electric-bubble active"></div>
      )}
    </div>
  );
};

export default AnimationEffectsTest;
