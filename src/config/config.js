const config = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:5000",
    wsUrl: process.env.REACT_APP_WS_URL || "ws://localhost:5000",
    timeout: 30000, // 30 seconds
  },

  // Audio Configuration
  audio: {
    sampleRate: 16000,
    channels: 1,
    bufferSize: 1024,
    silenceThreshold: 0.01,
    silenceDuration: 1000, // 1 second
  },

  // Speech Recognition Configuration
  speech: {
    language: "en-US",
    continuous: true,
    interimResults: true,
    maxAlternatives: 1,
  },

  // WebSocket Configuration
  websocket: {
    reconnectAttempts: 5,
    reconnectInterval: 1000,
    pingInterval: 30000,
    pingTimeout: 10000,
  },

  // UI Configuration
  ui: {
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
