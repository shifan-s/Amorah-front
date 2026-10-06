export const ADDITIONAL_PIECE_SHIPPING_FEE = 30;
export const LEGACY_PRODUCT_SHIPPING_CHARGE = 99;

export function getProductShippingChargeAmount(product) {
  const amount = product?.shippingChargeAmount;

  if (amount !== null && amount !== undefined && Number.isFinite(Number(amount))) {
    return Math.max(0, Number(amount));
  }

  return product?.shippingChargeApplies === false ? 0 : LEGACY_PRODUCT_SHIPPING_CHARGE;
}

export function calculateShippingCharge(items) {
  const shippableItems = items.filter((item) => item.available !== false);
  const itemCount = shippableItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0);

  if (itemCount === 0) {
    return 0;
  }

  const firstPieceCharge = Math.max(0, ...shippableItems.map(getProductShippingChargeAmount));
  return firstPieceCharge + ADDITIONAL_PIECE_SHIPPING_FEE * (itemCount - 1);
}