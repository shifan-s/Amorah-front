import api, { normalizeApiError, unwrapData } from './api.js';
import { normalizeProduct } from '../utils/productNormalizer.js';

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
}

async function requestProductList(url, params, fallbackMessage, config = {}) {
  try {
    const response = await api.get(url, { ...config, params: cleanParams(params) });
    const data = unwrapData(response) || {};
    return {
      products: (data.products || []).map(normalizeProduct),
      meta: data.meta || { page: 1, limit: params?.limit || 12, total: 0, totalPages: 1 },
    };
  } catch (error) {
    throw normalizeApiError(error, fallbackMessage);
  }
}

export function getProducts(params = {}, config = {}) {
  return requestProductList('/products', params, 'Unable to load products', config);
}

export async function getProductBySlug(slug) {
  try {
    const response = await api.get(`/products/${slug}`);
    return normalizeProduct(unwrapData(response)?.product);
  } catch (error) {
    throw normalizeApiError(error, 'Unable to load product');
  }
}

export function getFeaturedProducts(params = {}, config = {}) {
  return requestProductList('/products/featured', params, 'Unable to load featured products', config);
}

export function getNewArrivals(params = {}, config = {}) {
  return requestProductList('/products/new-arrivals', params, 'Unable to load new arrivals', config);
}

export function getBestSellers(params = {}, config = {}) {
  return requestProductList('/products/best-sellers', params, 'Unable to load best sellers', config);
}

export async function getRelatedProducts(slug, params = {}) {
  try {
    const response = await api.get(`/products/${slug}/related`, { params: cleanParams(params) });
    return (unwrapData(response)?.products || []).map(normalizeProduct);
  } catch (error) {
    throw normalizeApiError(error, 'Unable to load related products');
  }
}
