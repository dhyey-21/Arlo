import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "react-toastify";
import { SPEECH_CONFIG } from "../config/speechConfig";

export const useSpeech = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const browserSupportsSpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const { resetTranscript, finalTranscript, interimTranscript } =
    useSpeechRecognition({
      ...SPEECH_CONFIG.RECOGNITION_CONFIG,
      commands: [],
    });

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error(
        "Speech recognition is not supported in your browser. Please use Chrome."
      );
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (finalTranscript) {
      setTranscript(finalTranscript);
    }
  }, [finalTranscript]);

  useEffect(() => {
    if (interimTranscript) {
      setTranscript(interimTranscript);
    }
  }, [interimTranscript]);

  const connect = async () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error(
        "Speech recognition is not supported in your browser. Please use Chrome."
      );
      return false;
    }

    try {
      // Request microphone access first
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      // Start listening with optimized settings
      await SpeechRecognition.startListening({
        ...SPEECH_CONFIG.RECOGNITION_CONFIG,
        clearTranscriptOnListen: true,
      });

      setIsConnected(true);
      setIsListening(true);
      toast.success("Successfully connected! Agent is now listening.");
      return true;
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnected(false);
      setIsListening(false);
      if (error.name === "NotAllowedError") {
        toast.error(
          "Microphone access denied. Please allow microphone access."
        );
      } else {
        toast.error(
          "Failed to connect. Please check your microphone and try again."
        );
      }
      return false;
    }
  };

  const disconnect = () => {
    SpeechRecognition.stopListening();
    setIsConnected(false);
    setIsListening(false);
    setIsMuted(false);
    setTranscript("");
    toast.info("Successfully disconnected");
  };

  const toggleMute = () => {
    if (isMuted) {
      // When unmuting, start listening with optimized settings
      SpeechRecognition.startListening({
        ...SPEECH_CONFIG.RECOGNITION_CONFIG,
        clearTranscriptOnListen: true,
      });
      setIsListening(true);
      setIsMuted(false);
      toast.info("Agent unmuted");
    } else {
      SpeechRecognition.stopListening();
      setIsListening(false);
      setIsMuted(true);
      setTranscript("");
      resetTranscript();
      toast.info("Agent muted");
    }
  };

  // Test mode helper function
  const getTestResponse = () => {
    if (!SPEECH_CONFIG.TEST_MODE) return null;
    return SPEECH_CONFIG.TEST_RESPONSES[
      Math.floor(Math.random() * SPEECH_CONFIG.TEST_RESPONSES.length)
    ];
  };

  return {
    isConnected,
    isListening,
    isMuted,
    transcript,
    connect,
    disconnect,
    toggleMute,
    resetTranscript,
    setTranscript,
    browserSupportsSpeechRecognition,
    isTestMode: SPEECH_CONFIG.TEST_MODE,
    getTestResponse,
    silenceDuration: SPEECH_CONFIG.SILENCE_DURATION,
  };
};
