const config = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:3001",
    wsUrl: process.env.REACT_APP_WS_URL || "http://localhost:3001",
    timeout: 30000, // 30 seconds
  },

  // WebSocket Configuration
  websocket: {
    reconnectAttempts: 5,
    reconnectInterval: 3000,
    pingTimeout: 10000,
  },

  // UI Configuration
  ui: {
    theme: "dark",
    animations: true,
    messageDisplayDuration: 5000,
    animationDuration: 500,
    maxMessageLength: 1000,
  },

  // Feature Flags
  features: {
    enableAudioStreaming: true,
    enableWakeWord: true,
    enableTextToSpeech: true,
    enableHistory: true,
  },
};

export default config;
