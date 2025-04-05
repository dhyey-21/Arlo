import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ChatInterface from "../components/ChatInterface";
import ChatInput from "../components/ChatInput";
import { api } from "../services/api";
import { useWebSocket } from "../hooks/useWebSocket";
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
  setIsMuted,
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
  const [messages, setMessages] = useState([]);
  const lastTranscriptRef = useRef("");
  const silenceTimeoutRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Initialize WebSocket connection and handlers
  const { startAudioStream, stopAudioStream, sendAudioChunk } = useWebSocket({
    onAudioStart: () => {
      setIsConnected(true);
      setIsListening(true);
      toast.success("Successfully connected! Agent is now listening.");
    },
    onAudioStop: () => {
      setIsConnected(false);
      setIsListening(false);
      setIsMuted(false);
      setTranscript("");
      toast.info("Successfully disconnected");
    },
    onStateUpdate: (state) => {
      console.log("State updated:", state);
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
      toast.error(error.message || "Connection error occurred");
    },
  });

  // Save messages to history service
  useEffect(() => {
    let isSubscribed = true;
    if (messages.length > 0 && isSubscribed) {
      historyService.addConversation(messages);
    }
    return () => {
      isSubscribed = false;
    };
  }, [messages]);

  // Handle incoming transcripts
  useEffect(() => {
    let isSubscribed = true;
    if (transcript && isConnected && !isMuted && isSubscribed) {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      if (transcript !== lastTranscriptRef.current) {
        lastTranscriptRef.current = transcript;

        silenceTimeoutRef.current = setTimeout(() => {
          if (lastTranscriptRef.current === transcript && isSubscribed) {
            handleSendMessage(transcript);
            resetTranscript();
            lastTranscriptRef.current = "";
          }
        }, silenceDuration);
      }
    }
    return () => {
      isSubscribed = false;
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [transcript, isConnected, isMuted, silenceDuration]);

  // Cleanup audio resources
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // Initialize audio context and media stream
  useEffect(() => {
    if (isConnected && !isMuted) {
      const initAudio = async () => {
        try {
          audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
          mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });

          const source = audioContextRef.current.createMediaStreamSource(
            mediaStreamRef.current
          );
          const processor = audioContextRef.current.createScriptProcessor(
            1024,
            1,
            1
          );

          source.connect(processor);
          processor.connect(audioContextRef.current.destination);

          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            sendAudioChunk(inputData);
          };
        } catch (error) {
          console.error("Failed to initialize audio:", error);
          toast.error("Failed to initialize audio");
        }
      };

      initAudio();
    }

    return () => {
      // Cleanup media stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      // Cleanup audio context
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        try {
          audioContextRef.current.close();
        } catch (error) {
          console.error("Error closing audio context:", error);
        }
        audioContextRef.current = null;
      }
    };
  }, [isConnected, isMuted, sendAudioChunk]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup WebSocket connection
      api.cleanup();

      // Cleanup audio resources
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        try {
          audioContextRef.current.close();
        } catch (error) {
          console.error("Error closing audio context:", error);
        }
        audioContextRef.current = null;
      }

      // Clear any pending timeouts
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    };
  }, []);

  const handleSendMessage = async (text) => {
    if (!text?.trim()) return;

    const userMessage = { text, sender: "You", type: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setMorphing(true);
    setTimeout(() => {
      setSpeaking(true);
      setMorphing(false);
    }, 500);

    try {
      // Send message to backend
      const response = await api.chat.sendMessage(text);
      const { text: responseText, audioUrl } = response;

      const arloMessage = {
        text: responseText,
        sender: "Arlo",
        type: "assistant",
      };
      setMessages((prev) => [...prev, arloMessage]);

      // Play audio response
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          setMorphing(true);
          setTimeout(() => {
            setSpeaking(false);
            setMorphing(false);
          }, 500);
        };
        audio.play();
      } else {
        setMorphing(true);
        setTimeout(() => {
          setSpeaking(false);
          setMorphing(false);
        }, 500);
      }
    } catch (error) {
      console.error("Failed to get response:", error);
      toast.error("Failed to get response from Arlo");
      setMorphing(true);
      setTimeout(() => {
        setSpeaking(false);
        setMorphing(false);
      }, 500);
    }
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
