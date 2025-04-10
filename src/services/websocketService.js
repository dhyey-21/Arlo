class WebSocketService {
  constructor() {
    this.ws = null;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket("ws://localhost:8000/ws");

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      if (this.onMessage) {
        // Start in idle state when first connected
        this.onMessage({ status: 'idle' });
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);
        
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
        if (this.onMessage) {
          this.onMessage({ status: 'idle', error: error.message });
        }
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (this.onMessage) {
        this.onMessage({ status: 'idle', error: 'WebSocket error occurred' });
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed. Reconnecting...');
      if (this.onMessage) {
        this.onMessage({ status: 'idle' });
      }
      setTimeout(() => this.connect(), 3000);
    };
  }

  setMessageHandler(handler) {
    this.onMessage = handler;
  }

  // Helper method to manually send status updates
  updateStatus(status) {
    if (this.onMessage) {
      this.onMessage({ status });
    }
  }
}

export const websocketService = new WebSocketService();
