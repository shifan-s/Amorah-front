import PropTypes from 'prop-types';
import { useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiRefreshCw, FiStar, FiTrash2 } from 'react-icons/fi';

const maxBytes = 5 * 1024 * 1024;
const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const acceptedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

function isSupportedImage(file) {
  const extension = String(file.name || '').split('.').pop()?.toLowerCase();
  return acceptedTypes.includes(file.type) && acceptedExtensions.includes(extension);
}

function VariantImageGrid({ variantIndex, images, errors, onAltChange, onPrimary, onMove, onRemove, onReplace }) {
  const [replaceMessages, setReplaceMessages] = useState({});
  const [replacingIndex, setReplacingIndex] = useState(null);

  const setReplaceMessage = (imageIndex, message, tone = 'error') => {
    setReplaceMessages((current) => ({ ...current, [imageIndex]: { message, tone } }));
  };

  const replaceImage = async (event, imageIndex) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!isSupportedImage(file) || file.size > maxBytes) {
      setReplaceMessage(imageIndex, 'Please choose a JPG, PNG or WebP image under 5 MB.');
      return;
    }

    setReplacingIndex(imageIndex);
    setReplaceMessage(imageIndex, '');

    try {
      const result = await onReplace(imageIndex, file);
      setReplaceMessage(imageIndex, result.message, result.ok ? 'success' : 'error');
    } catch {
      setReplaceMessage(imageIndex, 'Image could not be replaced. Please try again.');
    } finally {
      setReplacingIndex(null);
    }
  };

  if (!images.length) {
    return <p className="border border-dashed border-[#DED2C5] bg-[#FAF6EE] p-4 text-sm text-[#6F6259]">No images uploaded for this colour yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      {images.map((image, imageIndex) => {
        const altError = errors[`variants.${variantIndex}.images.${imageIndex}.alt`];
        const replaceMessage = replaceMessages[imageIndex];
        const replaceInputId = `replace-image-${variantIndex}-${imageIndex}`;

        return (
          <article key={image.key || image.publicId || image.url} className="border border-[#DED2C5] bg-white p-3">
            <div className="relative">
              <img src={image.url} alt={image.alt || 'Product image preview'} className="aspect-[3/4] w-full object-cover" />
              {image.isPrimary ? (
                <span className="absolute left-2 top-2 bg-[#672F3B] px-2 py-1 text-xs font-semibold text-white">Main Image</span>
              ) : null}
            </div>
            <p className="mt-2 text-sm font-semibold text-[#302925]">Image {imageIndex + 1}</p>
            <p className="mt-1 text-xs text-[#6F6259]">{image.isPrimary ? 'Used as the main product image.' : 'Additional product image.'}</p>
            <div className="mt-3">
              <label htmlFor={`image-alt-${variantIndex}-${imageIndex}`}>Image Description</label>
              <input
                id={`image-alt-${variantIndex}-${imageIndex}`}
                value={image.alt}
                onChange={(event) => onAltChange(imageIndex, event.target.value)}
              />
              {altError ? <p className="mt-2 text-sm text-amorah-error">{altError}</p> : null}
            </div>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                onClick={() => onPrimary(imageIndex)}
                className={`inline-flex min-h-10 items-center justify-center gap-2 border px-3 text-sm font-semibold ${
                  image.isPrimary ? 'border-[#672F3B] bg-[#672F3B] text-white' : 'border-[#DED2C5] text-[#302925]'
                }`}
                aria-label={`Set image ${imageIndex + 1} as main`}
              >
                <FiStar aria-hidden="true" />
                Set as Main
              </button>
              <input
                id={replaceInputId}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="sr-only"
                onChange={(event) => replaceImage(event, imageIndex)}
                disabled={replacingIndex !== null}
              />
              <label
                htmlFor={replaceInputId}
                className="mb-0 inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 border border-[#DED2C5] px-3 text-sm font-semibold text-[#302925]"
              >
                <FiRefreshCw aria-hidden="true" />
                {replacingIndex === imageIndex ? 'Replacing...' : 'Replace Image'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onMove(imageIndex, -1)}
                  disabled={imageIndex === 0}
                  className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#DED2C5] px-3 text-sm font-semibold disabled:opacity-40"
                  aria-label={`Move image ${imageIndex + 1} earlier`}
                >
                  <FiArrowLeft aria-hidden="true" />
                  Earlier
                </button>
                <button
                  type="button"
                  onClick={() => onMove(imageIndex, 1)}
                  disabled={imageIndex === images.length - 1}
                  className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#DED2C5] px-3 text-sm font-semibold disabled:opacity-40"
                  aria-label={`Move image ${imageIndex + 1} later`}
                >
                  <FiArrowRight aria-hidden="true" />
                  Later
                </button>
              </div>
              <button
                type="button"
                onClick={() => onRemove(imageIndex)}
                className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#DED2C5] px-3 text-sm font-semibold text-[#672F3B]"
                aria-label={`Remove image ${imageIndex + 1}`}
              >
                <FiTrash2 aria-hidden="true" />
                Remove
              </button>
            </div>
            {replaceMessage?.message ? (
              <p className={`mt-2 text-sm ${replaceMessage.tone === 'success' ? 'text-amorah-success' : 'text-amorah-error'}`}>
                {replaceMessage.message}
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

VariantImageGrid.propTypes = {
  variantIndex: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  errors: PropTypes.object.isRequired,
  onAltChange: PropTypes.func.isRequired,
  onPrimary: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onReplace: PropTypes.func.isRequired,
};

export default VariantImageGrid;
