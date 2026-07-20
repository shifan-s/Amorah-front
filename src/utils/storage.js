const STORAGE_KEYS = {
  cart: 'amorah_cart',
  wishlist: 'amorah_wishlist',
  recentlyViewed: 'amorah_recently_viewed',
  auth: 'amorah_auth',
};

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readJson(key) {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeJson(key, value) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail in private mode or when full; app state should still work in memory.
  }
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isWishlistItem(item) {
  return (
    item &&
    typeof item.productId === 'string' &&
    (typeof item.slug === 'undefined' || typeof item.slug === 'string') &&
    (typeof item.name === 'undefined' || typeof item.name === 'string') &&
    (typeof item.image === 'undefined' || typeof item.image === 'string') &&
    (typeof item.currentPrice === 'undefined' || typeof item.currentPrice === 'number')
  );
}

function isCartItem(item) {
  return (
    item &&
    typeof item.id === 'string' &&
    typeof item.productId === 'string' &&
    typeof item.name === 'string' &&
    typeof item.slug === 'string' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    typeof item.regularPrice === 'number' &&
    (typeof item.salePrice === 'number' || item.salePrice === null || typeof item.salePrice === 'undefined') &&
    (typeof item.unitPrice === 'undefined' || typeof item.unitPrice === 'number') &&
    (typeof item.currentPrice === 'undefined' || typeof item.currentPrice === 'number') &&
    typeof item.selectedSize === 'string' &&
    typeof item.selectedColour === 'string' &&
    (typeof item.maxStock === 'undefined' || typeof item.maxStock === 'number') &&
    (typeof item.availableStock === 'undefined' || typeof item.availableStock === 'number')
  );
}

export function loadCartState() {
  const stored = readJson(STORAGE_KEYS.cart);

  if (!stored || !Array.isArray(stored.items) || !stored.items.every(isCartItem)) {
    return { mode: 'guest', items: [] };
  }

  return {
    mode: 'guest',
    items: stored.items.map((item) => ({
      ...item,
      itemKey: item.itemKey || item.id,
      availableStock: item.availableStock ?? item.maxStock ?? 1,
      unitPrice: item.unitPrice ?? item.currentPrice ?? item.salePrice ?? item.regularPrice,
      quantity: Math.max(1, Math.floor(item.quantity)),
    })),
  };
}

export function saveCartState(state) {
  if (state?.mode === 'authenticated') {
    writeJson(STORAGE_KEYS.cart, { items: [] });
    return;
  }

  writeJson(STORAGE_KEYS.cart, {
    items: Array.isArray(state?.items) ? state.items.filter(isCartItem) : [],
  });
}

export function loadWishlistState() {
  const stored = readJson(STORAGE_KEYS.wishlist);

  if (!stored || !isStringArray(stored.productIds)) {
    return { productIds: [] };
  }

  const items = Array.isArray(stored.items) ? stored.items.filter(isWishlistItem) : [];

  return {
    productIds: [...new Set(stored.productIds)],
    items,
  };
}

export function saveWishlistState(state) {
  writeJson(STORAGE_KEYS.wishlist, {
    productIds: isStringArray(state?.productIds) ? [...new Set(state.productIds)] : [],
    items: Array.isArray(state?.items) ? state.items.filter(isWishlistItem) : [],
  });
}

export function loadRecentlyViewedState() {
  const stored = readJson(STORAGE_KEYS.recentlyViewed);

  if (!stored || !isStringArray(stored.productIds)) {
    return { productIds: [] };
  }

  return {
    productIds: [...new Set(stored.productIds)].slice(0, 12),
  };
}

export function saveRecentlyViewedState(state) {
  writeJson(STORAGE_KEYS.recentlyViewed, {
    productIds: isStringArray(state?.productIds) ? [...new Set(state.productIds)].slice(0, 12) : [],
  });
}

function isAuthUser(user) {
  return (
    user &&
    typeof user.id === 'string' &&
    typeof user.fullName === 'string' &&
    typeof user.email === 'string' &&
    typeof user.mobile === 'string'
  );
}

export function loadAuthState() {
  const stored = readJson(STORAGE_KEYS.auth);

  if (!stored || !isAuthUser(stored.user)) {
    return { user: null, isAuthenticated: false, status: 'idle', error: null };
  }

  return {
    user: stored.user,
    isAuthenticated: true,
    status: 'idle',
    error: null,
  };
}

export function saveAuthState(state) {
  if (!state?.user || !state.isAuthenticated) {
    writeJson(STORAGE_KEYS.auth, { user: null });
    return;
  }

  if (state.user.rememberMe === false) {
    writeJson(STORAGE_KEYS.auth, { user: null });
    return;
  }

  writeJson(STORAGE_KEYS.auth, { user: state.user });
}
