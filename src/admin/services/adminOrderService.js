import api from '../../services/api.js';
import { downloadPdfBlob, filenameFromDisposition, readBlobError } from '../../utils/downloadBlob.js';

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

