import api, { normalizeApiError, setAccessToken, unwrapData } from './api.js';

let currentCustomerRequest = null;

export async function loginCustomer(payload) {
  try {
    const response = await api.post('/auth/login', payload);
    const session = unwrapData(response);
    setAccessToken(session?.accessToken);
    return session;
  } catch (error) {
    throw normalizeApiError(error, 'Unable to login');
  }
}

export async function refreshCustomerSession() {
  try {
    const response = await api.post('/auth/refresh-token', {}, {
      headers: { Authorization: undefined },
    });
    const session = unwrapData(response);
    setAccessToken(session?.accessToken);
    return session;
  } catch (error) {
    throw normalizeApiError(error, 'Unable to refresh session');
  }
}

export async function registerCustomer(payload) {
  try {
    const response = await api.post('/auth/register', payload);
    const session = unwrapData(response);
    setAccessToken(session?.accessToken);
    return session;
  } catch (error) {
    throw normalizeApiError(error, 'Unable to create account');
  }
}

export async function getCurrentCustomer() {
  if (!currentCustomerRequest) {
    currentCustomerRequest = api
      .get('/auth/me')
      .then((response) => unwrapData(response)?.user)
      .catch((error) => {
        throw normalizeApiError(error, 'Unable to restore session');
      })
      .finally(() => {
        currentCustomerRequest = null;
      });
  }

  return currentCustomerRequest;
}

export async function logoutCustomer() {
  try {
    await api.post('/auth/logout');
    setAccessToken('');
  } catch (error) {
    throw normalizeApiError(error, 'Unable to logout');
  }
}

export async function updateCustomerProfile(payload) {
  try {
    const response = await api.patch('/auth/profile', payload);
    return unwrapData(response)?.user;
  } catch (error) {
    throw normalizeApiError(error, 'Unable to update profile');
  }
}
