import api, { normalizeApiError, unwrapData } from '../../services/api.js';

function adminLoginError(error) {
  const normalized = normalizeApiError(error, 'Unable to login as admin.');

  if (normalized.status === 401) {
    normalized.message = 'Invalid email or password.';
  } else if (normalized.status === 403) {
    normalized.message = 'You do not have administrator access.';
  }

  return normalized;
}

export async function loginAdmin(credentials) {
  let user;

  try {
    const response = await api.post('/auth/login', credentials);
    user = unwrapData(response)?.user;
  } catch (error) {
    throw adminLoginError(error);
  }

  if (user?.role !== 'admin') {
    await logoutAdmin();
    const error = new Error('You do not have administrator access.');
    error.status = 403;
    throw error;
  }

  return user;
}

export async function logoutAdmin() {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    throw normalizeApiError(error, 'Unable to logout.');
  }
}
