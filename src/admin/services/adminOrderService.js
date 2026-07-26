import api from '../../services/api.js';
import { downloadPdfBlob, filenameFromDisposition, readBlobError } from '../../utils/downloadBlob.js';

function message(error, fallback) {
  return error.response?.data?.message || fallback;
}

export async function getAdminOrders(params = {}) {
  try {
    const response = await api.get('/admin/orders', { params });
    return response.data.data;
  } catch (error) {
    throw new Error(message(error, 'Orders could not be loaded. Please try again.'));
  }
}

export async function getAdminOrderStats() {
  try {
    const response = await api.get('/admin/orders/stats');
    return response.data.data;
  } catch (error) {
    throw new Error(message(error, 'Order statistics could not be loaded.'));
  }
}

export async function getAdminOrder(orderId) {
  try {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data.data;
  } catch (error) {
    throw new Error(message(error, 'Order could not be loaded.'));
  }
}

export async function updateAdminOrder(orderId, action, payload = {}) {
  try {
    const response = await api.patch(`/admin/orders/${orderId}/${action}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(message(error, 'Order could not be updated.'));
  }
}

export async function retryAdminOrderNotification(orderId) {
  try {
    const response = await api.post(`/admin/orders/${orderId}/retry-notification`);
    return response.data;
  } catch (error) {
    throw new Error(message(error, 'Notification retry failed.'));
  }
}

export async function downloadAdminOrderInvoice(orderNumber) {
  try {
    const response = await api.get(`/admin/orders/${orderNumber}/invoice`, {
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
