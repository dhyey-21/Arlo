import React from 'react';

const WaveAnimation = ({ isActive }) => {
  const waveContainerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '120px',
    overflow: 'hidden',
    zIndex: 9999,
    pointerEvents: 'none',
    opacity: isActive ? 1 : 0,
    transition: 'opacity 0.5s ease'
  };

  const wave1Style = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '200%',
    height: '100%',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath d='M0 40 Q 150 20 300 40 Q 450 60 600 40 Q 750 20 900 40 Q 1050 60 1200 40 L 1200 120 L 0 120 Z' fill='%230066cc' fill-opacity='0.6'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'repeat-x',
    backgroundPosition: '0 bottom',
    animation: 'wave1 10s linear infinite',
    opacity: 0.8,
    zIndex: 5,
    height: '100%'
  };

  const wave2Style = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '200%',
    height: '80%',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath d='M0 60 Q 200 40 400 60 Q 600 80 800 60 Q 1000 40 1200 60 L 1200 120 L 0 120 Z' fill='%233399ff' fill-opacity='0.7'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'repeat-x',
    backgroundPosition: '0 bottom',
    animation: 'wave2 13s linear infinite',
    opacity: 0.7,
    zIndex: 4
  };

  const wave3Style = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '200%',
    height: '60%',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath d='M0 80 Q 150 60 300 80 Q 450 100 600 80 Q 750 60 900 80 Q 1050 100 1200 80 L 1200 120 L 0 120 Z' fill='%2366ccff' fill-opacity='0.5'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'repeat-x',
    backgroundPosition: '0 bottom',
    animation: 'wave3 15s linear infinite',
    opacity: 0.6,
    zIndex: 3
  };

  return (
    <div style={waveContainerStyle}>
      <style>
        {`
          @keyframes wave1 {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes wave2 {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          @keyframes wave3 {
            0% { transform: translateX(-25%); }
            100% { transform: translateX(25%); }
          }
        `}
      </style>
      <div style={wave1Style}></div>
      <div style={wave2Style}></div>
      <div style={wave3Style}></div>
    </div>
  );
};

export default WaveAnimation;
