function fallbackFilename(value = 'Amorah-Invoice.pdf') {
  return String(value || 'Amorah-Invoice.pdf').replace(/[^A-Za-z0-9._-]/g, '-');
}

export function filenameFromDisposition(disposition = '', fallback = 'Amorah-Invoice.pdf') {
  const match = /filename="?([^";]+)"?/i.exec(disposition || '');
  return fallbackFilename(match?.[1] || fallback);
}

export async function readBlobError(error, fallback = 'Unable to download file.') {
  const data = error.response?.data;

  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const parsed = JSON.parse(text);
      return parsed.message || fallback;
    } catch {
      return fallback;
    }
  }

  return error.response?.data?.message || error.message || fallback;
}

export function downloadPdfBlob(blob, filename) {
  if (!(blob instanceof Blob) || !String(blob.type || '').toLowerCase().includes('application/pdf')) {
    throw new Error('The invoice response was not a PDF.');
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fallbackFilename(filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
