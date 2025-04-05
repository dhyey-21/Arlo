import { useEffect, useCallback, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";

export const useWebSocket = ({
  onAudioStart,
  onAudioStop,
  onAudioChunk,
  onStateUpdate,
  onError,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    try {
      const socket = api.initSocket();
      setIsConnected(socket?.connected || false);
    } catch (err) {
      console.error("Failed to initialize WebSocket:", err);
      setError(err);
      toast.error("Failed to connect to server");
    }
  }, []);

  // Setup event handlers
  useEffect(() => {
    const cleanup = api.setupWebSocketHandlers({
      onAudioStart: () => {
        console.log("Audio stream started");
        setIsConnected(true);
        onAudioStart?.();
      },
      onAudioStop: () => {
        console.log("Audio stream stopped");
        setIsConnected(false);
        onAudioStop?.();
      },
      onAudioChunk: (chunk) => {
        if (!isConnected) {
          console.warn("Received audio chunk while disconnected");
          return;
        }
        onAudioChunk?.(chunk);
      },
      onStateUpdate: (state) => {
        console.log("State updated:", state);
        onStateUpdate?.(state);
      },
      onError: (error) => {
        console.error("WebSocket error:", error);
        setError(error);
        toast.error(error.message || "Connection error occurred");
        onError?.(error);
      },
    });

    return cleanup;
  }, [
    onAudioStart,
    onAudioStop,
    onAudioChunk,
    onStateUpdate,
    onError,
    isConnected,
  ]);

  // Audio control functions
  const startAudioStream = useCallback(() => {
    if (!isConnected) {
      toast.error("Not connected to server");
      return;
    }
    try {
      api.audio.startStream();
    } catch (error) {
      console.error("Failed to start audio stream:", error);
      toast.error("Failed to start audio stream");
    }
  }, [isConnected]);

  const stopAudioStream = useCallback(() => {
    try {
      api.audio.stopStream();
    } catch (error) {
      console.error("Failed to stop audio stream:", error);
      toast.error("Failed to stop audio stream");
    }
  }, []);

  const sendAudioChunk = useCallback(
    (chunk) => {
      if (!isConnected) {
        console.warn("Attempted to send audio chunk while disconnected");
        return;
      }
      try {
        api.audio.sendAudioChunk(chunk);
      } catch (error) {
        console.error("Failed to send audio chunk:", error);
      }
    },
    [isConnected]
  );

  return {
    startAudioStream,
    stopAudioStream,
    sendAudioChunk,
    isConnected,
    error,
  };
};
