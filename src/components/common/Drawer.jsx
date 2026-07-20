import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import PropTypes from 'prop-types';
import IconButton from './IconButton.jsx';
import { trapFocus } from '../../utils/focusTrap.js';

const placements = {
  right: 'right-0 top-0 h-full w-full max-w-md',
  left: 'left-0 top-0 h-full w-full max-w-md',
  bottom: 'bottom-0 left-0 max-h-[85vh] w-full',
};

function Drawer({ open, title, ariaLabel, placement = 'right', children, onClose, footer }) {
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

  if (!open) {
    return null;
  }

  const drawer = (
    <div
      className="fixed inset-0 z-50 bg-amorah-black/50"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside
        ref={drawerRef}
        className={`amorah-focus fixed overflow-y-auto bg-amorah-white p-6 shadow-2xl ${placements[placement]}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-heading text-2xl font-semibold text-amorah-black">{title}</h2>
          <IconButton label="Close drawer" variant="ghost" size="sm" onClick={onClose}>
            <IoClose aria-hidden="true" />
          </IconButton>
        </div>
        <div className="mt-5 text-sm leading-6 text-amorah-brown">{children}</div>
        {footer ? <div className="mt-6 flex flex-col gap-3">{footer}</div> : null}
      </aside>
    </div>
  );

  return createPortal(drawer, document.body);
}

Drawer.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
  placement: PropTypes.oneOf(Object.keys(placements)),
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  footer: PropTypes.node,
};

export default Drawer;
