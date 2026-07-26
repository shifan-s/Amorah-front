import api, { normalizeApiError, unwrapData } from './api.js';

function normalizeBackendItem(item = {}) {
  const imageUrl = item.image?.url || '';

  return {
    id: item.itemId,
    itemKey: item.itemId,
    itemId: item.itemId,
    productId: item.productId,
    variantId: item.variantId,
    sizeId: item.sizeId,
    sku: item.sku,
    slug: item.slug,
    name: item.name,
    image: imageUrl,
    imageAlt: item.image?.alt || item.name,
    regularPrice: Number(item.regularPrice) || 0,
    salePrice: item.salePrice ?? null,
    currentPrice: Number(item.unitPrice) || 0,
    unitPrice: Number(item.unitPrice) || 0,
    lineTotal: Number(item.lineTotal) || 0,
    selectedSize: item.size,
    selectedColour: item.colourName,
    size: item.size,
    colourName: item.colourName,
    colourHex: item.colourHex,
    maxStock: Number(item.availableStock) || 0,
    availableStock: Number(item.availableStock) || 0,
    quantity: Number(item.quantity) || 1,
    available: item.available !== false,
    unavailableReason: item.unavailableReason || '',
    mainCategory: item.mainCategory || null,
  };
}

function normalizeBackendCart(cart = {}) {
  return {
    id: cart.id || '',
    items: (cart.items || []).map(normalizeBackendItem),
    summary: cart.summary || {
      itemCount: 0,
      uniqueItemCount: 0,
      subtotal: 0,
      shippingCharge: 0,
      tax: 0,
      total: 0,
      freeShippingThreshold: 1499,
      amountRemainingForFreeShipping: 1499,
    },
  };
}

async function requestCart(action, fallbackMessage) {
  try {
    const response = await action();
    return normalizeBackendCart(unwrapData(response)?.cart);
  } catch (error) {
    throw normalizeApiError(error, fallbackMessage);
  }
}

export function getBackendCart() {
  return requestCart(() => api.get('/cart'), 'Unable to load cart');
}

export function addBackendCartItem(payload) {
  return requestCart(() => api.post('/cart/items', payload), 'Unable to add item to cart');
}

export function updateBackendCartItem(itemId, quantity) {
  return requestCart(() => api.patch(`/cart/items/${itemId}`, { quantity }), 'Unable to update cart quantity');
}

export function removeBackendCartItem(itemId) {
  return requestCart(() => api.delete(`/cart/items/${itemId}`), 'Unable to remove cart item');
}

export function clearBackendCart() {
  return requestCart(() => api.delete('/cart'), 'Unable to clear cart');
}

export async function mergeGuestCart(items, accessToken, mergeId) {
  try {
    if (import.meta.env.DEV) {
      console.debug('Cart merge request', { items, mergeId });
    }
    const response = await api.post('/cart/merge', { items, mergeId }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = unwrapData(response) || {};
    if (import.meta.env.DEV) {
      console.debug('Cart merge response', { status: response.status, data });
    }
    return {
      cart: normalizeBackendCart(data.cart),
      warnings: data.warnings || [],
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Cart merge error', {
        status: error.response?.status || 0,
        details: error.response?.data || error.message,
      });
    }
    throw normalizeApiError(error, 'Unable to merge guest cart');
  }
}
