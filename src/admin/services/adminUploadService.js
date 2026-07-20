import api from '../../services/api.js';

function normalizeUploadedImage(image, index, altPrefix = '') {
  return {
    url: image.secureUrl || image.url,
    publicId: image.publicId,
    alt: altPrefix || '',
    sortOrder: index,
    isPrimary: index === 0,
  };
}

function readableUploadError(error) {
  const status = error.response?.status;
  const message = error.response?.data?.message || 'Upload failed';
  const details = error.response?.data?.errors || [];
  const detailText = details.join(' ').toLowerCase();

  if (status === 502 && (message.toLowerCase().includes('cloudinary') || detailText.includes('cloudinary'))) {
    if (detailText.includes('authentication') || message.toLowerCase().includes('authentication')) {
      return 'Image upload is not available because Cloudinary authentication failed. Please verify the backend Cloudinary credentials.';
    }

    if (detailText.includes('configuration') || message.toLowerCase().includes('configuration')) {
      return 'Image upload is not available because the Cloudinary configuration is invalid. Please verify the backend Cloudinary cloud name and upload folder.';
    }

    return 'Image upload is not available because Cloudinary rejected the backend upload request. Please verify the backend Cloudinary account and credentials.';
  }

  if (status === 503 && message.toLowerCase().includes('cloudinary')) {
    return 'Image upload is not configured. Please add the backend Cloudinary settings before uploading product images.';
  }

  return message;
}

async function uploadProductImageBatch(files, filenamePrefix) {
  const formData = new FormData();

  formData.append('uploadType', 'product');
  if (filenamePrefix) {
    formData.append('filenamePrefix', filenamePrefix);
  }

  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });

  const response = await api.post('/admin/uploads/images', formData);

  return response.data?.data?.images || [];
}

export async function uploadProductImages(files, filenamePrefix, altPrefix = '', onProgress) {
  const selectedFiles = Array.from(files);
  const uploadedImages = [];
  const failures = [];

  for (const [index, file] of selectedFiles.entries()) {
    onProgress?.({ current: index + 1, total: selectedFiles.length, fileName: file.name });

    try {
      const images = await uploadProductImageBatch([file], filenamePrefix);
      uploadedImages.push(...images.map((image) => normalizeUploadedImage(image, uploadedImages.length, altPrefix)));
    } catch (error) {
      failures.push({
        fileName: file.name,
        message: readableUploadError(error),
        errors: error.response?.data?.errors || [],
      });
    }
  }

  return { uploadedImages, failures };
}

export async function deleteUploadedImage(publicId) {
  if (!publicId) {
    return null;
  }

  const response = await api.delete('/admin/uploads/images', {
    data: { publicId },
  });

  return response.data?.data;
}
