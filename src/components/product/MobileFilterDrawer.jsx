import { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import PropTypes from 'prop-types';
import IconButton from '../common/IconButton.jsx';
import ProductFilters from './ProductFilters.jsx';
import { trapFocus } from '../../utils/focusTrap.js';

function MobileFilterDrawer({ open, onClose, ...filterProps }) {
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }

      trapFocus(event, drawerRef.current);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-amorah-black/50 transition-opacity motion-reduce:transition-none ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close filters overlay"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside
        ref={drawerRef}
        className={`amorah-focus fixed right-0 top-0 h-full w-[88vw] max-w-md overflow-y-auto bg-amorah-ivory p-5 transition-transform duration-200 motion-reduce:transition-none ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Product filters"
        tabIndex={open ? -1 : undefined}
      >
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-amorah-border pb-4">
          <h2 className="font-heading text-2xl font-semibold text-amorah-black">Filter products</h2>
          <IconButton label="Close filters" variant="ghost" size="sm" onClick={onClose}>
            <IoClose aria-hidden="true" />
          </IconButton>
        </div>
        <ProductFilters {...filterProps} />
      </aside>
    </div>
  );
}

MobileFilterDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func.isRequired,
  onSizeToggle: PropTypes.func.isRequired,
  onColourToggle: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  onAvailabilityToggle: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default MobileFilterDrawer;
