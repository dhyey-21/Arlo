import React from 'react';

const ElectricBubble = ({ isActive }) => {
  const bubbleStyle = {
    position: 'fixed',
    bottom: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '150px',
    height: '150px',
    opacity: isActive ? 1 : 0,
    pointerEvents: 'none',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 999,
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, rgba(124, 77, 255, 0.3) 0%, rgba(33, 150, 243, 0.3) 50%, rgba(0, 255, 255, 0.3) 100%)',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 0 20px rgba(124, 77, 255, 0.4), 0 0 40px rgba(33, 150, 243, 0.3), 0 0 60px rgba(0, 255, 255, 0.2), inset 0 0 30px rgba(124, 77, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    animation: isActive ? 'bubble-pulse 2s infinite' : 'none'
  };

  const beforeStyle = {
    content: "''",
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, rgba(124, 77, 255, 0.8), rgba(33, 150, 243, 0.8), rgba(0, 255, 255, 0.8), rgba(124, 77, 255, 0.8))',
    transform: 'translate(-50%, -50%)',
    animation: 'bubble-spin 3s linear infinite',
    filter: 'blur(3px)',
    mixBlendMode: 'overlay'
  };

  const afterStyle = {
    content: "''",
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '80%',
    height: '80%',
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, rgba(124, 77, 255, 0.8), rgba(33, 150, 243, 0.8), rgba(0, 255, 255, 0.8), rgba(124, 77, 255, 0.8))',
    transform: 'translate(-50%, -50%)',
    animation: 'bubble-spin 2s linear infinite reverse',
    filter: 'blur(2px)',
    mixBlendMode: 'overlay'
  };

  return (
    <div style={bubbleStyle}>
      <style>
        {`
          @keyframes bubble-pulse {
            0% {
              transform: translate(-50%, -50%) scale(0.95);
              box-shadow: 
                0 0 40px rgba(124, 77, 255, 0.5),
                0 0 80px rgba(33, 150, 243, 0.4),
                0 0 120px rgba(0, 255, 255, 0.3),
                inset 0 0 60px rgba(124, 77, 255, 0.3);
            }
            50% {
              transform: translate(-50%, -50%) scale(1.05);
              box-shadow: 
                0 0 60px rgba(124, 77, 255, 0.6),
                0 0 120px rgba(33, 150, 243, 0.5),
                0 0 180px rgba(0, 255, 255, 0.4),
                inset 0 0 80px rgba(124, 77, 255, 0.4);
            }
            100% {
              transform: translate(-50%, -50%) scale(0.95);
              box-shadow: 
                0 0 40px rgba(124, 77, 255, 0.5),
                0 0 80px rgba(33, 150, 243, 0.4),
                0 0 120px rgba(0, 255, 255, 0.3),
                inset 0 0 60px rgba(124, 77, 255, 0.3);
            }
          }
          
          @keyframes bubble-spin {
            0% {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }
        `}
      </style>
      {isActive && <div style={beforeStyle}></div>}
      {isActive && <div style={afterStyle}></div>}
    </div>
  );
};

export default ElectricBubble;
