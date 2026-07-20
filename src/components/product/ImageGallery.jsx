import { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import PropTypes from 'prop-types';
import IconButton from '../common/IconButton.jsx';
import { trapFocus } from '../../utils/focusTrap.js';
import { fallbackProductImage, handleProductImageError } from './productOptionUtils.js';

function ImageGallery({ images, activeImageIndex, onImageChange, productName, selectedColourName }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mainLoaded, setMainLoaded] = useState(false);
  const fullscreenRef = useRef(null);
  const thumbnailRef = useRef(null);
  const activeImage = images[activeImageIndex] || images[0] || {
    url: fallbackProductImage,
    alt: `${productName} product image`,
  };

  useEffect(() => {
    setMainLoaded(false);
  }, [activeImage.url]);

  useEffect(() => {
    thumbnailRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, [selectedColourName]);

  useEffect(() => {
    if (!isFullscreen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    fullscreenRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }

      trapFocus(event, fullscreenRef.current);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  const handlePrevious = () => {
    onImageChange(activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1);
  };

  const handleNext = () => {
    onImageChange(activeImageIndex >= images.length - 1 ? 0 : activeImageIndex + 1);
  };

  const showImageControls = images.length > 1;

  return (
    <div>
      <div className="lg:hidden">
        <button
          type="button"
          className="amorah-focus relative block overflow-hidden bg-amorah-light"
          onClick={() => setIsFullscreen(true)}
          aria-label={`Open fullscreen gallery for ${productName}`}
        >
          {!mainLoaded ? <span className="absolute inset-0 animate-pulse bg-amorah-beige/45" aria-hidden="true" /> : null}
          <img
            src={activeImage.url}
            alt={activeImage.alt}
            className="aspect-[3/4] h-full w-full object-cover"
            loading="eager"
            onLoad={() => setMainLoaded(true)}
            onError={handleProductImageError}
          />
        </button>
        <div ref={thumbnailRef} className="mt-3 flex gap-3 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              className={`amorah-focus h-24 w-20 shrink-0 border bg-amorah-light ${
                activeImageIndex === index ? 'border-amorah-maroon' : 'border-amorah-border'
              }`}
              aria-label={`View ${productName} in ${selectedColourName} image ${index + 1}`}
              onClick={() => onImageChange(index)}
            >
              <img src={image.url} alt="" className="h-full w-full object-cover" loading="lazy" onError={handleProductImageError} />
            </button>
          ))}
        </div>
      </div>

      <div className="hidden gap-4 lg:grid lg:grid-cols-2">
        {images.slice(0, 4).map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            className="amorah-focus block overflow-hidden bg-amorah-light"
            onClick={() => {
              onImageChange(index);
              setIsFullscreen(true);
            }}
            aria-label={`Open ${productName} in ${selectedColourName} image ${index + 1}`}
          >
            <img
              src={image.url}
              alt={index === 0 ? image.alt : ''}
              className="aspect-[3/4] h-full w-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              onError={handleProductImageError}
            />
          </button>
        ))}
      </div>

      {isFullscreen ? (
        <div
          ref={fullscreenRef}
          className="amorah-focus fixed inset-0 z-50 flex items-center justify-center bg-amorah-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Fullscreen gallery for ${productName}`}
          tabIndex={-1}
        >
          <IconButton
            label="Close fullscreen gallery"
            variant="secondary"
            className="absolute right-4 top-4"
            onClick={() => setIsFullscreen(false)}
          >
            <IoClose aria-hidden="true" />
          </IconButton>
          {showImageControls ? (
            <IconButton label="Previous product image" variant="secondary" className="absolute left-4 top-1/2 -translate-y-1/2" onClick={handlePrevious}>
              <FiChevronLeft aria-hidden="true" />
            </IconButton>
          ) : null}
          <img
            src={activeImage.url}
            alt={activeImage.alt}
            className="max-h-[88vh] max-w-full object-contain"
            onError={handleProductImageError}
          />
          {showImageControls ? (
            <IconButton label="Next product image" variant="secondary" className="absolute right-4 top-1/2 -translate-y-1/2" onClick={handleNext}>
              <FiChevronRight aria-hidden="true" />
            </IconButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    }),
  ).isRequired,
  activeImageIndex: PropTypes.number.isRequired,
  onImageChange: PropTypes.func.isRequired,
  productName: PropTypes.string.isRequired,
  selectedColourName: PropTypes.string.isRequired,
};

export default ImageGallery;
