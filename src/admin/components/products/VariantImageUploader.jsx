import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { FiTrash2, FiUpload } from 'react-icons/fi';
import { uploadProductImages } from '../../services/adminUploadService.js';
import { slugify } from '../../utils/productPayload.js';

const maxBytes = 5 * 1024 * 1024;
const maxImagesPerColour = 3;
const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const acceptedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

function isSupportedImage(file) {
  const extension = String(file.name || '').split('.').pop()?.toLowerCase();
  return acceptedTypes.includes(file.type) && acceptedExtensions.includes(extension);
}

function uploadSummary(count) {
  return `${count} ${count === 1 ? 'image' : 'images'} uploaded successfully.`;
}

function VariantImageUploader({ productName, variant, onUploaded, onUploadStateChange }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const nextPreviews = files.map((file, index) => ({
      key: `${file.name}-${file.lastModified}-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [files]);

  const savedImageCount = variant.images?.length || 0;
  const remainingSlots = Math.max(maxImagesPerColour - savedImageCount, 0);
  const usedPoses = new Set((variant.images || []).map((image) => image.pose));
  const missingPoses = ['front', 'side', 'back'].filter((pose) => !usedPoses.has(pose));

  const selectFiles = (event) => {
    const selected = Array.from(event.target.files || []);
    const unsupported = selected.find((file) => !isSupportedImage(file));
    const oversized = selected.find((file) => file.size > maxBytes);

    setSuccessMessage('');
    setUploadStatus('');

    if (selected.length > remainingSlots) {
      setError('Each colour can contain only front, side and back images.');
      return;
    }

    if (unsupported || oversized) {
      setError('Please upload JPG, PNG or WebP images within the allowed size.');
      return;
    }

    if (!selected.length) {
      setFiles([]);
      setError('');
      return;
    }

    setError('');
    setFiles(selected);
  };

  const removeSelectedFile = (fileIndex) => {
    setFiles((current) => current.filter((_, index) => index !== fileIndex));
    setError('');
    setSuccessMessage('');
    setUploadStatus('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const upload = async () => {
    if (!files.length) {
      setError('Choose one or more images first.');
      return;
    }

    setUploading(true);
    onUploadStateChange(true);
    setError('');
    setSuccessMessage('');
    setUploadStatus('');

    try {
      const altPrefix = `Amorah ${productName || 'product'} in ${variant.colourName || 'this colour'}`;
      const result = await uploadProductImages(files, slugify(`${productName}-${variant.colourName}`), altPrefix, ({ current, total }) => {
        setUploadStatus(`Uploading ${current} of ${total}...`);
      });

      if (result.uploadedImages.length) {
        onUploaded(result.uploadedImages);
        setSuccessMessage(uploadSummary(result.uploadedImages.length));
      }

      if (result.failures.length) {
        const failed = result.failures[0];
        const detail = failed.errors?.[0];
        const reason = failed.message || (typeof detail === 'string' ? detail : 'the upload failed');
        setError(`${result.failures.length} ${result.failures.length === 1 ? 'image' : 'images'} failed because ${reason}.`);
      }

      setFiles(result.failures.map((failure) => files.find((file) => file.name === failure.fileName)).filter(Boolean));
      if (!result.failures.length && inputRef.current) {
        inputRef.current.value = '';
      }
    } finally {
      setUploading(false);
      onUploadStateChange(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="border border-[#DED2C5] bg-[#FAF6EE] p-4">
      <label htmlFor={`images-${variant.key}`}>Images for This Colour</label>
      <p className="mt-1 text-sm text-[#6F6259]">
        Select the missing pose images in this order: front, side, back. A maximum of three images is allowed.
      </p>
      <input
        ref={inputRef}
        id={`images-${variant.key}`}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        onChange={selectFiles}
        disabled={uploading || remainingSlots === 0}
      />
      {remainingSlots === 0 ? (
        <p className="mt-2 text-sm text-[#6F6259]">Front, side and back images are complete.</p>
      ) : (
        <p className="mt-2 text-sm text-[#6F6259]">{remainingSlots} image slots remaining for this colour.</p>
      )}
      {previews.length ? (
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {previews.map((preview, index) => (
            <figure key={preview.key} className="border border-[#DED2C5] bg-white p-2">
              <p className="mb-2 text-sm font-semibold capitalize text-[#302925]">{missingPoses[index]} pose</p>
              <img src={preview.url} alt={preview.name} className="aspect-[3/4] w-full object-cover" />
              <figcaption className="mt-1 truncate text-xs text-[#6F6259]">{preview.name}</figcaption>
              <button
                type="button"
                onClick={() => removeSelectedFile(index)}
                disabled={uploading}
                className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 border border-[#DED2C5] px-3 text-sm font-semibold text-[#672F3B] disabled:opacity-50"
                aria-label={`Remove selected image ${preview.name}`}
              >
                <FiTrash2 aria-hidden="true" />
                Remove
              </button>
            </figure>
          ))}
        </div>
      ) : null}
      <div aria-live="polite" className="mt-2 text-sm text-[#6F6259]">
        {uploadStatus || successMessage}
      </div>
      {error ? <p className="mt-2 text-sm text-amorah-error">{error}</p> : null}
      <button
        type="button"
        onClick={upload}
        disabled={uploading || !files.length}
        className="mt-3 inline-flex min-h-10 items-center gap-2 bg-[#672F3B] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FiUpload aria-hidden="true" />
        {uploading ? uploadStatus || 'Uploading...' : 'Add Images'}
      </button>
    </div>
  );
}

VariantImageUploader.propTypes = {
  productName: PropTypes.string,
  variant: PropTypes.object.isRequired,
  onUploaded: PropTypes.func.isRequired,
  onUploadStateChange: PropTypes.func.isRequired,
};

export default VariantImageUploader;
