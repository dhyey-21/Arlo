import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthForm from "./components/AuthForm";
import Header from "./components/Header";
import ChatInterface from "./components/ChatInterface";
import ChatInput from "./components/ChatInput";
import "./App.css";

// Constants for API endpoints (for later)
const API_ENDPOINTS = {
  CHAT: "/api/chat",
};

const ElectricBubble = ({ active, morphing }) => (
  <div
    className={`electric-bubble ${active ? "active" : ""} ${
      morphing ? "morphing" : ""
    }`}
  >
    <div className="electric-sphere"></div>
    <div className="electric-lines"></div>
    <div className="electric-glow"></div>
    <div className="electric-particles"></div>
  </div>
);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [morphing, setMorphing] = useState(false);

  // Speech Recognition setup
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // Check browser support on mount
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error(
        "Speech recognition is not supported in your browser. Please use Chrome."
      );
    }
  }, [browserSupportsSpeechRecognition]);

  const handleConnect = async () => {
    console.log("Connect button clicked"); // Debug log

    if (!browserSupportsSpeechRecognition) {
      toast.error(
        "Speech recognition is not supported in your browser. Please use Chrome."
      );
      return;
    }

    try {
      // First request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      // Stop the stream right away - we just needed the permission
      stream.getTracks().forEach((track) => track.stop());

      // Test speech recognition
      await SpeechRecognition.startListening();
      await SpeechRecognition.stopListening();

      setIsConnected(true);
      toast.success("Successfully connected!");
      console.log("Successfully connected to speech recognition"); // Debug log
    } catch (error) {
      console.error("Connection error:", error); // Debug log
      setIsConnected(false);

      if (error.name === "NotAllowedError") {
        toast.error(
          "Microphone access denied. Please allow microphone access."
        );
      } else {
        toast.error(
          "Failed to connect. Please check your microphone and try again."
        );
      }
    }
  };

  const handleDisconnect = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    }
    setIsConnected(false);
    setIsListening(false);
    toast.info("Successfully disconnected");
  };

  const toggleListening = () => {
    console.log("Previous listening state:", isListening);
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
    console.log("New listening state:", !isListening);
  };

  const startListening = async () => {
    if (!isConnected) {
      toast.warning("Please connect first to use speech recognition.");
      return;
    }

    try {
      await SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    } catch (error) {
      console.error("Speech recognition error:", error);
      setIsListening(false);
      toast.error("Speech recognition error. Please try again.");
    }
  };

  const stopListening = async () => {
    if (isListening) {
      await SpeechRecognition.stopListening();
      if (transcript) {
        handleSendMessage(transcript);
        resetTranscript();
      }
    }
    setIsListening(false);
  };

  const handleSendMessage = async (text) => {
    if (!text?.trim()) return;

    const userMessage = { text, sender: "You", type: "user" };
    setMessages((prev) => [...prev, userMessage]);

    // Start morphing animation
    setMorphing(true);
    setTimeout(() => {
      setSpeaking(true);
      setMorphing(false);
    }, 500);

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    const responses = [
      "Hello! How can I help you today?",
      "I understand you're trying to reach out. What can I do for you?",
      "I'm here to assist you. What would you like to know?",
      "Thanks for your message. How may I help you?",
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    const arloMessage = { text: response, sender: "Arlo", type: "assistant" };

    const utterance = new SpeechSynthesisUtterance(response);
    utterance.onstart = () => {
      setMessages((prev) => [...prev, arloMessage]);
    };

    utterance.onend = () => {
      // Start morphing animation back
      setMorphing(true);
      setTimeout(() => {
        setSpeaking(false);
        setMorphing(false);
      }, 500);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleLogout = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    }
    setLoggedIn(false);
    setIsConnected(false);
    setIsListening(false);
    setSpeaking(false);
    setMessages([]);
  };

  return (
    <div className={`app-container ${speaking ? "speaking" : ""}`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
      />
      {!loggedIn ? (
        <AuthForm setLoggedIn={setLoggedIn} />
      ) : (
        <>
          <Header
            handleLogout={handleLogout}
            handleConnect={handleConnect}
            handleDisconnect={handleDisconnect}
            isConnected={isConnected}
          />
          <ChatInterface
            messages={messages}
            speaking={speaking}
            isListening={isListening}
          />
          <ChatInput
            isListening={isListening}
            toggleListening={toggleListening}
            transcript={transcript}
            isSupported={browserSupportsSpeechRecognition}
            speaking={speaking}
            isConnected={isConnected}
          />
          <div
            className={`wave-container ${isListening ? "active" : ""} ${
              morphing ? "morphing" : ""
            }`}
          >
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
          </div>
          <ElectricBubble active={speaking} morphing={morphing} />
        </>
      )}
    </div>
  );
}

export default App;
