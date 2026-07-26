import axios from 'axios';
import { getStoredAuthTokens } from '../utils/storage.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const accessToken = getStoredAuthTokens().accessToken;
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export function normalizeApiError(error, fallback = 'Unable to complete request') {
  if (error.response) {
    return {
      message: error.response.data?.message || fallback,
      status: error.response.status,
      errors: error.response.data?.errors || [],
    };
  }

  if (error.code === 'ECONNABORTED') {
    return {
      message: 'The request timed out. Please try again.',
      status: 408,
      errors: [],
    };
  }

  if (error.message === 'Network Error') {
    console.error('Amorah API connection failed.', error);
    return {
      message: 'Unable to connect to the API server.',
      status: 0,
      errors: [],
    };
  }

  return {
    message: fallback,
    status: 0,
    errors: [],
  };
}

export function unwrapData(response) {
  return response.data?.data;
}

export default api;
