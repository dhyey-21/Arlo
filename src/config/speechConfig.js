export const SPEECH_CONFIG = {
  TEST_MODE: true,
  SILENCE_DURATION: 2000, // Increased to 2 seconds for longer messages
  RECOGNITION_CONFIG: {
    continuous: true,
    language: "en-US",
    interimResults: true,
    maxAlternatives: 1,
    clearTranscriptOnListen: false,
    commands: [],
  },
  TEST_RESPONSES: [
    "I understand what you're saying. Let me help you with that.",
    "That's interesting. Could you tell me more about it?",
    "I'm processing your request. Please continue speaking.",
    "I'm here to help. What else would you like to discuss?",
    "I understand your message. How can I assist you further?",
  ],
};
