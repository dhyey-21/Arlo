import config from '../config/config';
import { toast } from 'react-toastify';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.messageHandlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = config.backend.reconnectAttempts || 5;
    this.reconnectDelay = config.backend.reconnectDelay || 3000;
    this.connectionListeners = new Set();
    console.log('WebSocket service initialized with config:', {
      wsUrl: config.backend.wsUrl,
      maxReconnectAttempts: this.maxReconnectAttempts,
      reconnectDelay: this.reconnectDelay
    });
  }

  connect() {
    if (this.socket) {
      console.log('WebSocket already exists, not creating new connection');
      return;
    }

    try {
      console.log('Connecting to WebSocket at:', config.backend.wsUrl);
      this.socket = new WebSocket(config.backend.wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connection opened');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyConnectionChange(true);

        // Send initial message to confirm connection
        this.send({ type: 'connection_check' });
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        this.isConnected = false;
        this.notifyConnectionChange(false);
        this.socket = null;

        // Don't reconnect on normal closure or if max attempts reached
        if (event.code !== 1000 && event.code !== 1001 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.notifyConnectionChange(false);
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket received message:', message);
          
          // Handle state messages
          switch (message.type) {
            case 'listening':
            case 'responding':
            case 'response_complete':
              console.log('Handling state message:', message.type);
              const handler = this.messageHandlers.get(message.type);
              if (handler) {
                handler(message.data);
              } else {
                console.log('No handler found for message type:', message.type);
              }
              break;
            case 'transcription':
            case 'response':
              console.log('Handling data message:', message.type);
              const dataHandler = this.messageHandlers.get(message.type);
              if (dataHandler) {
                dataHandler(message.data);
              } else {
                console.log('No handler found for message type:', message.type);
              }
              break;
            default:
              console.log('Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('Error processing message:', error, 'Raw message:', event.data);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting WebSocket');
      this.socket.close(1000, 'Normal closure');
      this.socket = null;
      this.isConnected = false;
      this.notifyConnectionChange(false);
    }
  }

  send(message) {
    if (this.socket && this.isConnected) {
      try {
        const messageStr = JSON.stringify(message);
        console.log('Sending WebSocket message:', messageStr);
        this.socket.send(messageStr);
        return true;
      } catch (error) {
        console.error('Error sending message:', error);
        return false;
      }
    }
    console.log('Cannot send message, socket not connected');
    return false;
  }

  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.min(this.reconnectAttempts, 5);
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    setTimeout(() => this.connect(), delay);
  }

  addConnectionListener(listener) {
    console.log('Adding connection listener');
    this.connectionListeners.add(listener);
    // Immediately notify the new listener of current state
    listener(this.isConnected);
  }

  removeConnectionListener(listener) {
    console.log('Removing connection listener');
    this.connectionListeners.delete(listener);
  }

  notifyConnectionChange(connected) {
    console.log('Notifying connection change:', connected);
    this.connectionListeners.forEach(listener => {
      try {
        listener(connected);
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }

  addMessageHandler(type, handler) {
    console.log('Adding message handler for type:', type);
    this.messageHandlers.set(type, handler);
  }

  removeMessageHandler(type) {
    console.log('Removing message handler for type:', type);
    this.messageHandlers.delete(type);
  }
}

export const websocketService = new WebSocketService();
