import config from '../config/config';
import { websocketService } from './websocketService';
import { toast } from 'react-toastify';

class AssistantService {
  constructor() {
    this.handlers = {};
    this.isConnected = false;
    this.setupWebSocket();
  }

  setupWebSocket() {
    websocketService.setupEventListeners({
      onConnect: () => {
        this.isConnected = true;
        if (this.handlers.onConnect) {
          this.handlers.onConnect();
        }
      },
      onDisconnect: () => {
        this.isConnected = false;
        if (this.handlers.onDisconnect) {
          this.handlers.onDisconnect();
        }
      },
      onMessage: (message) => {
        switch (message.type) {
          case 'transcription':
            if (this.handlers.onTranscription) {
              this.handlers.onTranscription(message.data);
            }
            break;
          case 'response':
            if (this.handlers.onResponse) {
              this.handlers.onResponse(message.data);
            }
            break;
          default:
            console.log('Unknown message type:', message.type);
        }
      },
      onError: (error) => {
        if (this.handlers.onError) {
          this.handlers.onError(error);
        }
      }
    });
  }

  // Send a text message to the assistant
  async sendMessage(text) {
    try {
      const response = await fetch(`${config.backend.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Text-to-Speech
  async speak(text) {
    try {
      const response = await fetch(`${config.backend.baseUrl}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to speak');
      return await response.json();
    } catch (error) {
      this._handleError('Failed to speak', error);
      throw error;
    }
  }

  // Assistant status
  async getStatus() {
    try {
      const response = await fetch(`${config.backend.apiUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Command execution
  async executeCommand(command) {
    try {
      const response = await fetch(`${config.backend.baseUrl}/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });
      if (!response.ok) throw new Error('Failed to execute command');
      return await response.json();
    } catch (error) {
      this._handleError('Failed to execute command', error);
      throw error;
    }
  }

  // WebSocket event setup
  setupEventListeners(callbacks) {
    websocketService.setupEventListeners({
      [this.config.events.WAKE_WORD_DETECTED]: callbacks.onWakeWord,
      [this.config.events.COMMAND_STARTED]: callbacks.onCommandStart,
      [this.config.events.COMMAND_FINISHED]: callbacks.onCommandFinish,
      [this.config.events.TTS_STARTED]: callbacks.onTTSStart,
      [this.config.events.TTS_FINISHED]: callbacks.onTTSFinish,
      [this.config.events.ERROR]: callbacks.onError,
    });
  }
}

export const assistantService = new AssistantService();