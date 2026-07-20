import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import PropTypes from 'prop-types';
import IconButton from './IconButton.jsx';
import { trapFocus } from '../../utils/focusTrap.js';

function Modal({ open, title, ariaLabel, children, onClose, footer }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }

      trapFocus(event, dialogRef.current);
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

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-amorah-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        ref={dialogRef}
        className="amorah-focus max-h-[90vh] w-full max-w-lg overflow-y-auto bg-amorah-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-heading text-2xl font-semibold text-amorah-black">{title}</h2>
          <IconButton label="Close modal" variant="ghost" size="sm" onClick={onClose}>
            <IoClose aria-hidden="true" />
          </IconButton>
        </div>
        <div className="mt-5 text-sm leading-6 text-amorah-brown">{children}</div>
        {footer ? <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">{footer}</div> : null}
      </section>
    </div>
  );

  return createPortal(modal, document.body);
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  footer: PropTypes.node,
};

export default Modal;
