const STORAGE_KEY = 'amorah_buy_now_intent';

function isValidItem(item) {
  return Boolean(
    item &&
      typeof item.productId === 'string' &&
      typeof item.variantId === 'string' &&
      typeof item.sizeId === 'string' &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0,
  );
}

export function saveBuyNowIntent(item, returnUrl = '/checkout') {
  if (!isValidItem(item)) return null;

  const intent = { item, returnUrl, createdAt: Date.now() };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(intent));
  return intent;
}

export function loadBuyNowIntent() {
  try {
    const intent = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY));
    if (!intent || !isValidItem(intent.item) || Date.now() - intent.createdAt > 30 * 60 * 1000) {
      clearBuyNowIntent();
      return null;
    }
    return intent;
  } catch {
    clearBuyNowIntent();
    return null;
  }
}

export function clearBuyNowIntent() {
  window.sessionStorage.removeItem(STORAGE_KEY);
}
