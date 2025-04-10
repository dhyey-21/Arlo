const config = {
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
    defaultVoice: "en-US",
    defaultVolume: 1.0,
    defaultRate: 1.0,
    defaultPitch: 1.0,
  },
};

export default config;
