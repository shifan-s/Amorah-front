import api, { normalizeApiError, unwrapData } from './api.js';

let currentCustomerRequest = null;

export async function loginCustomer(payload) {
  try {
    const response = await api.post('/auth/login', payload);
    return unwrapData(response)?.user;
  } catch (error) {
    throw normalizeApiError(error, 'Unable to login');
  }
}

export async function registerCustomer(payload) {
  try {
    const response = await api.post('/auth/register', payload);
    return unwrapData(response)?.user;
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
