import api from '../../services/api.js';

const pendingProductLists = new Map();

function normalizeParams(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
}

export function getReadableApiError(error, fallback = 'Request failed.') {
  const message = error.response?.data?.message || fallback;
  const details = error.response?.data?.errors || [];

  if (!Array.isArray(details) || details.length === 0) {
    return message;
  }

  const firstDetail = details[0];
  if (typeof firstDetail === 'string') {
    return `${message}: ${firstDetail}`;
  }

  return firstDetail.message || message;
}

export function mapApiFieldErrors(error) {
  const nextErrors = {};
  const details = error.response?.data?.errors || [];

  details.forEach((item) => {
    if (item.field) {
      nextErrors[item.field] = item.message;
    }
  });

  return nextErrors;
}

export async function getProducts(filters = {}) {
  const params = normalizeParams(filters);
  const requestKey = JSON.stringify(params);

  if (!pendingProductLists.has(requestKey)) {
    const request = api
      .get('/admin/products', { params })
      .then((response) => ({
        products: response.data?.data?.products || [],
        meta: response.data?.data?.meta || { page: 1, limit: 20, total: 0, totalPages: 1 },
      }))
      .finally(() => {
        pendingProductLists.delete(requestKey);
      });

    pendingProductLists.set(requestKey, request);
  }

  return pendingProductLists.get(requestKey);
}

export async function getProductById(productId) {
  const response = await api.get(`/admin/products/${productId}`);
  return response.data?.data?.product;
}

export async function createProduct(payload) {
  const response = await api.post('/admin/products', payload);
  return response.data?.data?.product;
}

export async function updateProduct(productId, payload) {
  const response = await api.patch(`/admin/products/${productId}`, payload);
  return response.data?.data?.product;
}

export async function updateProductStatus(productId, status) {
  const response = await api.patch(`/admin/products/${productId}/status`, { status });
  return response.data?.data?.product;
}

export async function updateProductStock(productId, payload) {
  const response = await api.patch(`/admin/products/${productId}/stock`, payload);
  return response.data?.data;
}

export async function archiveProduct(productId) {
  const response = await api.patch(`/admin/products/${productId}/archive`);
  return response.data?.data?.product;
}

export async function deleteProduct(productId) {
  const response = await api.delete(`/admin/products/${productId}`);
  return response.data?.data;
}
