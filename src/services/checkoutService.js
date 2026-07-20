import api, { normalizeApiError, unwrapData } from './api.js';

function normalizePreviewItem(item = {}) {
  const imageUrl = item.productImage?.url || '';

  return {
    ...item,
    id: [item.productId, item.variantId, item.sizeId].filter(Boolean).join('-'),
    productId: item.productId,
    name: item.productName,
    slug: item.productSlug,
    image: imageUrl,
    imageAlt: item.productImage?.alt || item.productName,
    currentPrice: Number(item.unitPrice) || 0,
    unitPrice: Number(item.unitPrice) || 0,
    lineTotal: Number(item.lineTotal) || 0,
    selectedSize: item.size,
    selectedColour: item.colourName,
    quantity: Number(item.quantity) || 1,
    available: true,
  };
}

function normalizePreview(preview = {}) {
  return {
    items: (preview.items || []).map(normalizePreviewItem),
    shippingAddress: preview.shippingAddress || null,
    billingAddress: preview.billingAddress || null,
    summary: preview.summary || {
      itemCount: 0,
      subtotal: 0,
      shippingCharge: 0,
      tax: 0,
      total: 0,
      currency: 'INR',
    },
    paymentMethod: preview.paymentMethod || 'razorpay',
    customerNotes: preview.customerNotes || '',
  };
}

export async function createCheckoutPreview(payload) {
  try {
    const response = await api.post('/checkout/preview', {
      shippingAddressId: payload.shippingAddressId,
      billingSameAsShipping: payload.billingSameAsShipping,
      billingAddressId: payload.billingSameAsShipping ? null : payload.billingAddressId,
      customerNotes: payload.customerNotes || '',
    });

    return normalizePreview(unwrapData(response)?.preview);
  } catch (error) {
    throw normalizeApiError(error, 'Unable to create checkout preview');
  }
}
