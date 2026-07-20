import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import PropTypes from 'prop-types';
import Button from '../common/Button.jsx';
import IconButton from '../common/IconButton.jsx';
import { trapFocus } from '../../utils/focusTrap.js';

const suggestedSearches = ['Linen dresses', 'Rose kurtis', 'Co-ord sets', 'Ethnic wear'];

function SearchDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.focus();
    window.setTimeout(() => inputRef.current?.focus(), 0);

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
      className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-amorah-black/50 transition-opacity motion-reduce:transition-none ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close search overlay"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside
        ref={drawerRef}
        className={`amorah-focus fixed right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-amorah-white p-6 transition-transform duration-200 motion-reduce:transition-none ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Search Amorah products"
        tabIndex={open ? -1 : undefined}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amorah-brown">Search</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold text-amorah-black">Find your next piece</h2>
          </div>
          <IconButton label="Close search" variant="ghost" size="sm" onClick={onClose}>
            <IoClose aria-hidden="true" />
          </IconButton>
        </div>

        <form
          className="mt-8"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const query = inputRef.current?.value.trim();

            if (query) {
              navigate(`/search?q=${encodeURIComponent(query)}`);
              onClose();
            }
          }}
        >
          <label htmlFor="site-search">Search Amorah</label>
          <div className="mt-2 flex gap-3">
            <input ref={inputRef} id="site-search" type="search" placeholder="Search dresses, kurtis, co-ords..." />
            <Button type="submit" className="shrink-0" aria-label="Submit search">
              <FiSearch aria-hidden="true" />
              Search
            </Button>
          </div>
        </form>

        <div className="mt-8">
          <h3 className="font-heading text-xl font-semibold text-amorah-black">Popular searches</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {suggestedSearches.map((search) => (
              <Link
                key={search}
                to={`/search?q=${encodeURIComponent(search)}`}
                className="amorah-focus border border-amorah-border bg-amorah-light px-4 py-2 text-sm font-semibold text-amorah-brown hover:text-amorah-black"
                onClick={onClose}
              >
                {search}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

SearchDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SearchDrawer;
