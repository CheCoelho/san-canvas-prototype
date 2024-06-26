// apiClient.ts

import axios, { AxiosResponse } from 'axios';

// Function to create a client for the Express API
const createExpressApiClient = () => {
  const baseURL = 'http://localhost:3000';

  const callExpressApi = async (endpoint: string, data?: any): Promise<AxiosResponse<any>> => {
    try {
      const response = await axios.post(`${baseURL}${endpoint}`, data);
      return response;
    } catch (error) {
      throw new Error(`Express API call failed: ${error}`);
    }
  };

  return {
    callExpressApi,
  };
};

// Function to create a client for the Flask API
const createFlaskApiClient = (flaskApiPort: number) => {
  const baseURL = `http://localhost:${flaskApiPort}`;

  const callFlaskApi = async (endpoint: string, data?: any): Promise<AxiosResponse<any>> => {
    try {
      const response = await axios.post(`${baseURL}${endpoint}`, data);
      return response;
    } catch (error) {
      throw new Error(`Flask API call failed: ${error}`);
    }
  };

  return {
    callFlaskApi,
  };
};

export { createExpressApiClient, createFlaskApiClient };
