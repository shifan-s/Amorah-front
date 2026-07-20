import api from './api.js';
import { normalizeApiError, unwrapData } from './api.js';
import { downloadPdfBlob, filenameFromDisposition, readBlobError } from '../utils/downloadBlob.js';

export async function getMyOrders(params = {}) {
  try {
    const response = await api.get('/orders/my', { params });
    const data = unwrapData(response) || {};

    return {
      orders: data.orders || [],
      pagination: data.pagination || {
        page: 1,
        limit: 10,
        totalOrders: 0,
        totalPages: 0,
      },
    };
  } catch (error) {
    throw normalizeApiError(error, 'Unable to load orders');
  }
}

export async function getOrderByNumber(orderNumber) {
  try {
    const response = await api.get(`/orders/${orderNumber}`);
    return unwrapData(response)?.order;
  } catch (error) {
    throw normalizeApiError(error, 'Unable to load order');
  }
}

export async function downloadOrderInvoice(orderNumber) {
  try {
    const response = await api.get(`/orders/${orderNumber}/invoice`, {
      responseType: 'blob',
      headers: { Accept: 'application/pdf' },
    });
    const filename = filenameFromDisposition(
      response.headers?.['content-disposition'],
      `Amorah-Invoice-${orderNumber}.pdf`,
    );

    downloadPdfBlob(response.data, filename);
  } catch (error) {
    throw new Error(await readBlobError(error, 'Unable to download invoice.'));
  }
}
