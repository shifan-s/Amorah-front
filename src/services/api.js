import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 12000,
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

  return {
    message: error.message === 'Network Error' ? 'Unable to reach the Amorah API.' : fallback,
    status: 0,
    errors: [],
  };
}

export function unwrapData(response) {
  return response.data?.data;
}

export default api;
