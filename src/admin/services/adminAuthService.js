import api from '../../services/api.js';

export async function loginAdmin(credentials) {
  await api.post('/auth/login', credentials);
  const response = await api.get('/auth/me');
  const user = response.data?.data?.user;

  if (user?.role !== 'admin') {
    await logoutAdmin();
    const error = new Error('Only Amorah administrators can access this area.');
    error.status = 403;
    throw error;
  }

  return user;
}

export async function getAdminMe() {
  const response = await api.get('/auth/me');
  const user = response.data?.data?.user;

  if (user?.role !== 'admin') {
    const error = new Error('Only Amorah administrators can access this area.');
    error.status = 403;
    throw error;
  }

  return user;
}

export async function logoutAdmin() {
  await api.post('/auth/logout');
}
