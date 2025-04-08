import axios from "axios";
import { io } from "socket.io-client";
import config from "../config/config";

const API_BASE_URL = process.env.REACT_APP_API_URL || config.api.baseUrl;
const WS_URL = process.env.REACT_APP_WS_URL || config.api.wsUrl;

// Create axios instance with default config
const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: config.api.timeout,
});

// WebSocket instance
let socket = null;
let reconnectAttempts = 0;
let reconnectTimer = null;

// Initialize WebSocket connection
const initSocket = () => {
  if (!socket) {
    socket = io(WS_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: config.websocket.reconnectAttempts,
      reconnectionDelay: config.websocket.reconnectInterval,
      timeout: config.websocket.pingTimeout,
    });

    // Handle connection events
    socket.on("connect", () => {
      console.log("WebSocket connected");
      reconnectAttempts = 0;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason);
      if (reason === "io server disconnect") {
        // Server initiated disconnect, try to reconnect
        socket.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      if (reconnectAttempts < config.websocket.reconnectAttempts) {
        reconnectTimer = setTimeout(() => {
          reconnectAttempts++;
          socket.connect();
        }, config.websocket.reconnectInterval);
      }
    });
  }
  return socket;
};

// Chat functions
const chatService = {
  sendMessage: async (message) => {
    try {
      const response = await client.post("/chat/message", { message });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to send message"
      );
    }
  },

  getHistory: async () => {
    try {
      const response = await client.get("/chat/history");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get history");
    }
  },

  clearHistory: async () => {
    try {
      const response = await client.delete("/chat/history");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to clear history"
      );
    }
  },
};

// WebSocket event handlers
const setupWebSocketHandlers = (callbacks) => {
  const socket = initSocket();

  // State events
  socket.on("state:update", callbacks.onStateUpdate);
  socket.on("error", callbacks.onError);

  // Cleanup function
  return () => {
    socket.off("state:update");
    socket.off("error");
  };
};

// Cleanup function
const cleanup = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

export const api = {
  client,
  initSocket,
  cleanup,
  chat: chatService,
  setupWebSocketHandlers,
};
