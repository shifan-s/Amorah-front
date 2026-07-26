import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken = '';
let refreshPromise = null;

export function setAccessToken(token = '') {
  accessToken = String(token || '');
}

api.interceptors.request.use((config) => {
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = String(error.config?.url || '');
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._refreshAttempted &&
      !requestUrl.startsWith('/auth/login') &&
      !requestUrl.startsWith('/auth/register') &&
      !requestUrl.startsWith('/auth/refresh')
    ) {
      originalRequest._refreshAttempted = true;
      try {
        refreshPromise ||= api
          .post('/auth/refresh-token', {}, { _refreshAttempted: true })
          .then((response) => response.data?.data?.accessToken)
          .finally(() => {
            refreshPromise = null;
          });
        const refreshedToken = await refreshPromise;
        setAccessToken(refreshedToken);
        originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
        return api(originalRequest);
      } catch {
        setAccessToken('');
      }
    }

    if (error.response?.status === 401 && requestUrl.startsWith('/admin/')) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('amorah:admin-unauthorized'));
      }
    }

    return Promise.reject(error);
  },
);

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
