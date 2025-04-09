import React from 'react';
import '../styles/ConnectionStatus.css';

const ConnectionStatus = ({ isConnected, isListening, isLoading }) => {
  const getStatusText = () => {
    if (isLoading) return 'Connecting...';
    if (isConnected && isListening) return 'Listening...';
    if (isConnected) return 'Connected';
    return 'Disconnected';
  };

  return (
    <div className="connection-status">
      <div className={`status-dot ${isLoading ? 'loading' : isConnected ? 'connected' : 'disconnected'}`} />
      <span className="status-text">{getStatusText()}</span>
    </div>
  );
};

export default ConnectionStatus;
