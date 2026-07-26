import api, { normalizeApiError, unwrapData } from '../../services/api.js';
import { clearAuthTokens, saveAuthTokens } from '../../utils/storage.js';

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
  let session;

  try {
    const response = await api.post('/auth/login', credentials);
    session = unwrapData(response);
  } catch (error) {
    throw adminLoginError(error);
  }

  const user = session?.user;

  if (user?.role !== 'admin') {
    await logoutAdmin();
    const error = new Error('You do not have administrator access.');
    error.status = 403;
    throw error;
  }

  saveAuthTokens(
    {
      accessToken: session?.accessToken,
      refreshToken: session?.refreshToken,
    },
    true,
  );

  return user;
}

export async function logoutAdmin() {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    throw normalizeApiError(error, 'Unable to logout.');
  } finally {
    clearAuthTokens();
  }
}
