import api from '../../services/api.js';
import { getReadableApiError } from './adminProductService.js';

const pendingRefundLists = new Map();

function normalizeParams(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
}

export async function getRefunds(filters = {}) {
  const params = normalizeParams(filters);
  const requestKey = JSON.stringify(params);

  try {
    if (!pendingRefundLists.has(requestKey)) {
      const request = api
        .get('/admin/refunds', { params })
        .then((response) => ({
          refunds: response.data?.data?.refunds || [],
          pagination: response.data?.data?.pagination || { page: 1, limit: 20, totalRefunds: 0, totalPages: 1 },
        }))
        .finally(() => {
          pendingRefundLists.delete(requestKey);
        });

      pendingRefundLists.set(requestKey, request);
    }

    return await pendingRefundLists.get(requestKey);
  } catch (error) {
    throw new Error(getReadableApiError(error, 'Unable to load refunds.'));
  }
}

export async function getRefundById(refundId) {
  try {
    const response = await api.get(`/admin/refunds/${refundId}`);
    return response.data?.data?.refund;
  } catch (error) {
    throw new Error(getReadableApiError(error, 'Unable to load refund.'));
  }
}

export async function getOrderRefundEligibility(orderNumber) {
  try {
    const response = await api.get(`/admin/orders/${orderNumber}/refund-eligibility`);
    return response.data?.data;
  } catch (error) {
    throw new Error(getReadableApiError(error, 'Unable to check refund eligibility.'));
  }
}

export async function initiateOrderRefund(orderNumber, reason) {
  try {
    const response = await api.post(`/admin/orders/${orderNumber}/refund`, { reason });
    return response.data?.data?.refund;
  } catch (error) {
    throw new Error(getReadableApiError(error, 'Unable to initiate refund.'));
  }
}

export async function reconcileRefund(refundId) {
  try {
    const response = await api.post(`/admin/refunds/${refundId}/reconcile`);
    return response.data?.data?.refund;
  } catch (error) {
    throw new Error(getReadableApiError(error, 'Unable to reconcile refund.'));
  }
}

export async function retryRefund(refundId) {
  try {
    const response = await api.post(`/admin/refunds/${refundId}/retry`);
    return response.data?.data?.refund;
  } catch (error) {
    throw new Error(getReadableApiError(error, 'Unable to retry refund.'));
  }
}
