import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ChatInterface from "../Components/ChatInterface";
import ChatInput from "../Components/ChatInput";
import historyService from "../services/historyService";
import "../styles/MainPage.css";

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

function MainPage({
  setLoggedIn,
  isConnected,
  setIsConnected,
  isListening,
  setIsListening,
  isMuted,
  handleToggleMute,
  transcript,
  setTranscript,
  resetTranscript,
  isTestMode,
  getTestResponse,
  silenceDuration,
  browserSupportsSpeechRecognition,
  speaking,
  setSpeaking,
  morphing,
  setMorphing,
}) {
  const [messages, setMessages] = useState(() => {
    // Initialize messages from localStorage if available
    const savedMessages = localStorage.getItem("arlo_messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const lastTranscriptRef = useRef("");
  const silenceTimeoutRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("arlo_messages", JSON.stringify(messages));
  }, [messages]);

  // Handle incoming transcripts
  useEffect(() => {
    if (transcript && isConnected && !isMuted) {
      // Clear any existing timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      // Only process new transcripts (not the same as last time)
      if (transcript !== lastTranscriptRef.current) {
        // Update the last transcript
        lastTranscriptRef.current = transcript;

        // Set a new timeout to process the transcript after a period of silence
        silenceTimeoutRef.current = setTimeout(() => {
          if (lastTranscriptRef.current === transcript) {
            handleSendMessage(transcript);
            resetTranscript();
            lastTranscriptRef.current = "";
          }
        }, silenceDuration);
      }
    }
  }, [transcript, isConnected, isMuted, silenceDuration]);

  // Cleanup timeout and reset last transcript when muted
  useEffect(() => {
    if (isMuted) {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      lastTranscriptRef.current = "";
    }
  }, [isMuted]);

  const handleSendMessage = async (text) => {
    if (!text?.trim()) return;

    const userMessage = { text, sender: "You", type: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setMorphing(true);
    setTimeout(() => {
      setSpeaking(true);
      setMorphing(false);
    }, 500);

    await new Promise((resolve) => setTimeout(resolve, 500));

    // In test mode, use predefined responses
    // Later, this will be replaced with actual backend API calls
    const response = isTestMode
      ? getTestResponse()
      : "Backend response will go here";
    const arloMessage = { text: response, sender: "Arlo", type: "assistant" };

    const utterance = new SpeechSynthesisUtterance(response);
    utterance.onstart = () => {
      setMessages((prev) => [...prev, arloMessage]);
    };

    utterance.onend = async () => {
      setMorphing(true);
      setTimeout(() => {
        setSpeaking(false);
        setMorphing(false);
      }, 500);

      // Save the conversation to history
      try {
        const currentMessages = [...messages, userMessage, arloMessage];
        await historyService.addConversation(currentMessages);
      } catch (error) {
        console.error("Error saving to history:", error);
        toast.error("Failed to save conversation to history");
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Determine when to show wave animation
  const shouldShowWave = isListening && !isMuted && !speaking;

  return (
    <div className="main-content">
      <ChatInterface
        messages={messages}
        speaking={speaking}
        isListening={isListening}
      />
      <ChatInput
        isListening={isListening}
        toggleListening={handleToggleMute}
        transcript={transcript}
        speaking={speaking}
        isConnected={isConnected}
        isMuted={isMuted}
        isSupported={browserSupportsSpeechRecognition}
      />
      <div
        className={`wave-container ${shouldShowWave ? "active" : ""} ${
          morphing ? "morphing" : ""
        }`}
      >
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>
      <ElectricBubble active={speaking} morphing={morphing} />
    </div>
  );
}

export default MainPage;
