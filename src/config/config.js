const config = {
  // Backend Configuration
  backend: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws',
    reconnectAttempts: 5,
    reconnectDelay: 2000,
    healthEndpoint: '/health',
  },
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:3000",
    wsUrl: process.env.REACT_APP_WS_URL || "http://localhost:3000",
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

  // AI Assistant Configuration
  assistant: {
    endpoints: {
      voice: "/api/voice",
      command: "/api/command",
      tts: "/api/tts",
      status: "/api/status",
    },
    settings: {
      wakeWord: "arlo",
      voiceLanguage: "en-US",
      ttsVoice: "en-US-Neural2-D",
      silenceThreshold: -50,
      commandTimeout: 10000,
    },
    events: {
      WAKE_WORD_DETECTED: "wake_word_detected",
      COMMAND_STARTED: "command_started",
      COMMAND_FINISHED: "command_finished",
      TTS_STARTED: "tts_started",
      TTS_FINISHED: "tts_finished",
      ERROR: "error",
    },
  },
};

export default config;
