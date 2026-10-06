import { calculateShippingCharge } from '../../utils/shipping.js';

export const FREE_SHIPPING_THRESHOLD = 1499;

export function getCartTotals(items) {
  const subtotal = items.reduce(
    (total, item) => total + (item.unitPrice ?? item.currentPrice ?? item.salePrice ?? item.regularPrice) * item.quantity,
    0,
  );
  const shipping = calculateShippingCharge(items, subtotal, FREE_SHIPPING_THRESHOLD);
  const tax = 0;
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
  };
}
