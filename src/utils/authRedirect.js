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

export function isUnauthorizedError(error) {
  return Number(error?.status) === 401;
}
