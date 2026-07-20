export const FREE_SHIPPING_THRESHOLD = 1499;
export const SHIPPING_FEE = 99;

export function getCartTotals(items) {
  const subtotal = items.reduce(
    (total, item) => total + (item.unitPrice ?? item.currentPrice ?? item.salePrice ?? item.regularPrice) * item.quantity,
    0,
  );
  const shipping = subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
  };
}
