import api, { normalizeApiError, unwrapData } from './api.js';
import { attachSubcategories, normalizeCategory, sortCategories } from '../utils/categoryNormalizer.js';

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
}

async function requestCategories(params, fallbackMessage, config = {}) {
  try {
    const response = await api.get('/categories', { ...config, params: cleanParams(params) });
    return sortCategories((unwrapData(response)?.categories || []).map(normalizeCategory));
  } catch (error) {
    throw normalizeApiError(error, fallbackMessage);
  }
}

export async function getCategories(params = {}, config = {}) {
  return requestCategories(params, 'Unable to load categories', config);
}

export async function getHomepageCategories() {
  return requestCategories({ showOnHomepage: true }, 'Unable to load homepage categories');
}

export async function getNavigationCategories() {
  const categories = await requestCategories({ showInNavigation: true }, 'Unable to load navigation categories');
  return attachSubcategories(categories);
}

export async function getCategoryBySlug(slug) {
  try {
    const response = await api.get(`/categories/${slug}`);
    return normalizeCategory(unwrapData(response)?.category);
  } catch (error) {
    throw normalizeApiError(error, 'Unable to load category');
  }
}
