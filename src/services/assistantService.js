import axios from 'axios';
import config from '../config/config';

class AssistantService {
  constructor() {
    this.baseUrl = config.backend.baseUrl;
    this.healthEndpoint = config.backend.healthEndpoint;
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getStatus() {
    try {
      console.log('Checking health at:', `${this.baseUrl}${this.healthEndpoint}`);
      const response = await this.axiosInstance.get(this.healthEndpoint);
      
      // Validate response
      if (!response.data || response.data.status !== 'healthy') {
        console.warn('Health check returned unexpected response:', response.data);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error(`Health check failed with status: ${error.response?.status || error.message}`);
    }
  }
}

export const assistantService = new AssistantService();