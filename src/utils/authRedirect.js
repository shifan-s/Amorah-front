export const CHECKOUT_LOGIN_MESSAGE = 'Please log in to continue with checkout.';

export function getLocationPath(location) {
  return `${location.pathname || '/'}${location.search || ''}${location.hash || ''}`;
}

export function getCheckoutLoginState(from = '/checkout') {
  return {
    from,
    message: CHECKOUT_LOGIN_MESSAGE,
  };
}

export function getSafeReturnUrl(value, fallback = '/') {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return fallback;
  }

  try {
    const url = new URL(value, window.location.origin);
    return url.origin === window.location.origin
      ? `${url.pathname}${url.search}${url.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}

export function isUnauthorizedError(error) {
  return Number(error?.status) === 401;
}
