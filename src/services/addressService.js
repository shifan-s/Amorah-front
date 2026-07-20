import api, { normalizeApiError, unwrapData } from './api.js';

export async function getSavedAddresses() {
  try {
    const response = await api.get('/users/me/addresses');
    return unwrapData(response)?.addresses || [];
  } catch (error) {
    throw normalizeApiError(error, 'Unable to load saved addresses');
  }
}

export async function createSavedAddress(payload) {
  try {
    const response = await api.post('/users/me/addresses', payload);
    return unwrapData(response)?.addresses || [];
  } catch (error) {
    throw normalizeApiError(error, 'Unable to save address');
  }
}

export async function updateSavedAddress(addressId, payload) {
  try {
    const response = await api.patch(`/users/me/addresses/${addressId}`, payload);
    return unwrapData(response)?.addresses || [];
  } catch (error) {
    throw normalizeApiError(error, 'Unable to update address');
  }
}

export async function deleteSavedAddress(addressId) {
  try {
    const response = await api.delete(`/users/me/addresses/${addressId}`);
    return unwrapData(response)?.addresses || [];
  } catch (error) {
    throw normalizeApiError(error, 'Unable to delete address');
  }
}

export async function setDefaultSavedAddress(addressId) {
  try {
    const response = await api.patch(`/users/me/addresses/${addressId}/default`);
    return unwrapData(response)?.addresses || [];
  } catch (error) {
    throw normalizeApiError(error, 'Unable to set default address');
  }
}
