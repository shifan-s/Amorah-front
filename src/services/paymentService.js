import api, { getApiErrorMessage, normalizeApiError, unwrapData } from './api.js';

export async function createRazorpayOrder(payload) {
  try {
    console.log('Creating one Razorpay order request');
    const response = await api.post('/payments/razorpay/create-order', {
      items: payload.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        sizeId: item.sizeId,
        quantity: item.quantity,
      })),
      checkoutMode: payload.checkoutMode || 'cart',
      shippingAddressId: payload.shippingAddressId,
      billingSameAsShipping: payload.billingSameAsShipping,
      billingAddressId: payload.billingSameAsShipping ? null : payload.billingAddressId,
      customerNotes: payload.customerNotes || '',
      idempotencyKey: payload.idempotencyKey,
    });

    const payment = unwrapData(response)?.payment;
    const result = {
      ...payment,
      keyId: response.data?.keyId || payment?.keyId,
      order: response.data?.order || payment?.order,
    };

    if (!result?.order?.id && !result?.razorpayOrderId) {
      throw new Error(response.data?.message || 'Unable to create Razorpay order.');
    }

    return result;
  } catch (error) {
    const message = getApiErrorMessage(error, 'Unable to create secure payment order');
    const normalizedError = normalizeApiError(error, message);
    normalizedError.message = message;
    throw normalizedError;
  }
}

export async function verifyRazorpayPayment(payload) {
  try {
    const response = await api.post('/payments/razorpay/verify', {
      orderNumber: payload.orderNumber,
      razorpay_order_id: payload.razorpay_order_id,
      razorpay_payment_id: payload.razorpay_payment_id,
      razorpay_signature: payload.razorpay_signature,
    });

    return unwrapData(response)?.order;
  } catch (error) {
    throw normalizeApiError(error, 'Unable to verify payment');
  }
}

export async function getRazorpayPaymentStatus(orderNumber) {
  try {
    const response = await api.get(`/payments/razorpay/status/${orderNumber}`);
    return unwrapData(response)?.payment;
  } catch (error) {
    throw normalizeApiError(error, 'Unable to check payment status');
  }
}
