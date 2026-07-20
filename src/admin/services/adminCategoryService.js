import api from '../../services/api.js';

function unwrapCategory(response) {
  return response.data?.data?.category;
}

export async function getAdminCategories(filters = {}) {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
  const response = await api.get('/admin/categories', { params });

  return {
    categories: response.data?.data?.categories || [],
    meta: response.data?.data?.meta || { total: 0 },
  };
}

export async function getAdminCategory(categoryId) {
  const response = await api.get(`/admin/categories/${categoryId}`);
  return unwrapCategory(response);
}

export async function createCategory(payload) {
  const response = await api.post('/admin/categories', payload);
  return unwrapCategory(response);
}

export async function updateCategory(categoryId, payload) {
  const response = await api.patch(`/admin/categories/${categoryId}`, payload);
  return unwrapCategory(response);
}

export async function deleteCategory(categoryId) {
  const response = await api.delete(`/admin/categories/${categoryId}`);
  return unwrapCategory(response);
}
