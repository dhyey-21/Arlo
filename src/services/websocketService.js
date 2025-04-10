class WebSocketService {
  constructor() {
    this.ws = null;
    this.onMessage = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.isConnected = false;
    this.isReconnecting = false;
    this.lastError = null;
    this.connect();
  }

  connect() {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket("ws://localhost:8000/ws");
    this.isConnected = false;
    this.isReconnecting = false;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.lastError = null;
      if (this.onMessage) {
        this.onMessage({ status: 'connected' });
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        // Enhanced status handling
        let enhancedData = { ...data };
        
        // If we receive a transcript, we're in responding state
        if (data.transcript !== undefined) {
          enhancedData.status = 'responding';
        }
        
        // If we receive a response, we go back to listening
        if (data.response !== undefined) {
          // First send responding status
          if (this.onMessage) {
            this.onMessage({ ...data, status: 'responding' });
          }
          // Then after a short delay, send the response
          setTimeout(() => {
            if (this.onMessage) {
              this.onMessage({ ...data, status: 'listening' });
            }
          }, 100);
          return;
        }
        
        // Ensure status is always present
        if (!enhancedData.status) {
          enhancedData.status = 'idle';
        }
        
        // Emit the message event for subscribers
        if (this.onMessage) {
          this.onMessage(enhancedData);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        this.lastError = error;
        if (this.onMessage) {
          this.onMessage({ 
            status: 'error', 
            error: error.message,
            type: 'parse_error'
          });
        }
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.lastError = error;
      if (this.onMessage) {
        this.onMessage({ 
          status: 'error', 
          error: error.message,
          type: 'connection_error'
        });
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed. Code:', event.code, 'Reason:', event.reason);
      this.isConnected = false;
      
      // Don't reconnect if connection was closed intentionally
      if (event.code === 1000) {
        if (this.onMessage) {
          this.onMessage({ status: 'disconnected' });
        }
        return;
      }

      // Handle reconnection logic
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.isReconnecting = true;
        if (this.onMessage) {
          this.onMessage({ 
            status: 'reconnecting',
            attempts: this.reconnectAttempts + 1,
            maxAttempts: this.maxReconnectAttempts
          });
        }
        
        setTimeout(() => {
          this.connect();
        }, this.reconnectDelay);
        
        this.reconnectAttempts++;
      } else {
        if (this.onMessage) {
          this.onMessage({ 
            status: 'disconnected',
            error: 'Maximum reconnection attempts reached'
          });
        }
      }
    };

    // Keep connection alive with ping
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Ping every 30 seconds
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'User initiated disconnect');
    }
    clearInterval(this.pingInterval);
    this.isConnected = false;
    this.isReconnecting = false;
    this.reconnectAttempts = 0;
  }

  setMessageHandler(handler) {
    this.onMessage = handler;
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      isReconnecting: this.isReconnecting,
      lastError: this.lastError,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  // Helper method to manually send status updates
  updateStatus(status) {
    if (this.onMessage) {
      this.onMessage({ status });
    }
  }
}

export const websocketService = new WebSocketService();
