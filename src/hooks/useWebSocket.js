import { useEffect, useCallback, useRef } from "react";
import io from "socket.io-client";
import config from "../config/config";

export const useWebSocket = ({ onStateUpdate, onMessage, onError }) => {
  const socketRef = useRef(null);

  const connect = useCallback(() => {
    try {
      socketRef.current = io(config.api.wsUrl, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: config.websocket.reconnectAttempts,
        reconnectionDelay: config.websocket.reconnectInterval,
      });

      socketRef.current.on("connect", () => {
        onStateUpdate({ connected: true });
      });

      socketRef.current.on("disconnect", () => {
        onStateUpdate({ connected: false });
      });

      socketRef.current.on("error", (error) => {
        onError(error);
      });

      // Handle STT responses
      socketRef.current.on("transcript", (data) => {
        onMessage({ type: "transcript", text: data.text });
      });

      // Handle TTS responses
      socketRef.current.on("response", (data) => {
        onMessage({ type: "response", text: data.text });
      });
    } catch (error) {
      onError(error);
    }
  }, [onStateUpdate, onMessage, onError]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("message", message);
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect, sendMessage };
};
