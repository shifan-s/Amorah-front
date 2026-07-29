import api, { normalizeApiError, unwrapData } from './api.js';

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
      shippingAddressId: payload.shippingAddressId,
      billingSameAsShipping: payload.billingSameAsShipping,
      billingAddressId: payload.billingSameAsShipping ? null : payload.billingAddressId,
      customerNotes: payload.customerNotes || '',
      idempotencyKey: payload.idempotencyKey,
    });

    const payment = unwrapData(response)?.payment;

    if (!payment?.razorpayOrderId || !payment?.amount) {
      throw new Error('Create-order response did not include a valid Razorpay order');
    }

    return payment;
  } catch (error) {
    console.error('Unable to create Razorpay order:', error);
    console.error('Backend error:', error.response?.data);
    throw normalizeApiError(error, 'Unable to create secure payment order');
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
