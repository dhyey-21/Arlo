import config from '../config/config';
import { toast } from 'react-toastify';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.messageHandlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 2000;
  }

  connect() {
    if (this.socket) {
      return;
    }

    this.socket = new WebSocket(config.backend.wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyHandlers('connection', { status: 'connected' });
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      this.socket = null;
      this.notifyHandlers('connection', { status: 'disconnected' });
      this.tryReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.notifyHandlers('error', { error });
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'transcription') {
          this.notifyHandlers('message', message.data);
        } else if (message.type === 'response') {
          this.notifyHandlers('response', message.data);
        } else {
          console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        this.notifyHandlers('error', { message: 'Failed to parse message' });
      }
    };
  }

  setupEventListeners(handlers) {
    if (handlers.onConnect) {
      this.messageHandlers.set('connect', handlers.onConnect);
    }
    if (handlers.onDisconnect) {
      this.messageHandlers.set('disconnect', handlers.onDisconnect);
    }
    if (handlers.onMessage) {
      this.messageHandlers.set('message', handlers.onMessage);
    }
    if (handlers.onError) {
      this.messageHandlers.set('error', handlers.onError);
    }

    // Start connection after setting up handlers
    this.connect();
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }

  tryReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.notifyHandlers('error', { message: 'Failed to reconnect to server' });
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    setTimeout(() => {
      if (!this.isConnected) {
        this.connect();
      }
    }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)); // Exponential backoff
  }

  handleMessage(message) {
    // Handle different message types from the backend
    switch (message.type) {
      case 'response':
        this.notifyHandlers('response', message.data);
        break;
      case 'transcription':
        this.notifyHandlers('transcription', message.data);
        break;
      default:
        if (message.message === 'Connected') {
          this.notifyHandlers('connection', { status: 'connected' });
        }
        console.log('Received message:', message);
    }
  }

  subscribe(eventType, handler) {
    if (!this.messageHandlers.has(eventType)) {
      this.messageHandlers.set(eventType, new Set());
    }
    this.messageHandlers.get(eventType).add(handler);
  }

  unsubscribe(eventType, handler) {
    const handlers = this.messageHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  notifyHandlers(type, data) {
    const handler = this.messageHandlers.get(type);
    if (handler && typeof handler === 'function') {
      handler(data);
    }
  }

  // Health check
  async checkHealth() {
    try {
      const response = await fetch(`${config.backend.baseUrl}${config.backend.healthEndpoint}`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export const websocketService = new WebSocketService();
