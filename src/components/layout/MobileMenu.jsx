import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { FiChevronDown, FiHeart, FiPackage, FiUser } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCustomerNavigationLinks } from './DesktopNavigation.jsx';
import BrandLogo from './BrandLogo.jsx';
import IconButton from '../common/IconButton.jsx';
import { trapFocus } from '../../utils/focusTrap.js';
import { logoutCustomer } from '../../services/authService.js';
import { clearAuthUser, selectAuth } from '../../store/slices/authSlice.js';
import { switchToGuestCart } from '../../store/slices/cartSlice.js';
import { loadCartState } from '../../utils/storage.js';

function MobileMenu({ open, onClose }) {
  const menuRef = useRef(null);
  const { links: navigationLinks, loading } = useCustomerNavigationLinks();
  const [openCategory, setOpenCategory] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    setLoggingOut(true);
    try {
      await logoutCustomer();
    } catch {
      toast.error('Session logout could not be confirmed. Your local session was cleared.');
    } finally {
      dispatch(clearAuthUser());
      dispatch(switchToGuestCart(loadCartState()));
      setLoggingOut(false);
      onClose();
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }

      trapFocus(event, menuRef.current);
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
        aria-label="Close menu overlay"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside
        ref={menuRef}
        className={`amorah-focus fixed left-0 top-0 flex h-full w-[88vw] max-w-sm flex-col overflow-y-auto bg-amorah-ivory p-5 transition-transform duration-200 motion-reduce:transition-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        tabIndex={open ? -1 : undefined}
      >
        <div className="flex items-center justify-between gap-4 border-b border-amorah-border pb-5">
          <BrandLogo size="sm" />
          <IconButton label="Close menu" variant="ghost" size="sm" onClick={onClose}>
            <IoClose aria-hidden="true" />
          </IconButton>
        </div>

        <nav className="mt-6" aria-label="Mobile primary navigation">
          <ul className="space-y-1">
            {navigationLinks.map((link) => (
              <li key={link.to}>
                {link.children?.length ? (
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          `amorah-focus block flex-1 px-2 py-3 font-heading text-2xl font-semibold ${
                            isActive ? 'text-amorah-maroon' : 'text-amorah-black'
                          }`
                        }
                        onClick={onClose}
                      >
                        {link.label}
                      </NavLink>
                      <button
                        type="button"
                        className="amorah-focus flex h-11 w-11 items-center justify-center text-amorah-brown"
                        aria-label={`Toggle ${link.label} subcategories`}
                        aria-expanded={openCategory === link.to}
                        onClick={() => setOpenCategory((current) => (current === link.to ? '' : link.to))}
                      >
                        <FiChevronDown
                          aria-hidden="true"
                          className={`transition ${openCategory === link.to ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                    {openCategory === link.to ? (
                      <div className="ml-4 border-l border-amorah-border pl-4">
                        <Link
                          to={link.to}
                          className="amorah-focus block py-2 text-sm font-semibold text-amorah-brown hover:text-amorah-maroon"
                          onClick={onClose}
                        >
                          View All
                        </Link>
                        {link.children.map((subcategory) => (
                          <Link
                            key={subcategory.id || subcategory.slug}
                            to={`${link.to}?subcategory=${subcategory.slug}`}
                            className="amorah-focus block py-2 text-sm font-semibold text-amorah-brown hover:text-amorah-maroon"
                            onClick={onClose}
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `amorah-focus block px-2 py-3 font-heading text-2xl font-semibold ${
                        isActive ? 'text-amorah-maroon' : 'text-amorah-black'
                      }`
                    }
                    onClick={onClose}
                  >
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
            {loading ? (
              <li className="px-2 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-amorah-brown">
                Loading collection
              </li>
            ) : null}
          </ul>
        </nav>

        <div className="mt-8 border-t border-amorah-border pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amorah-terracotta">My Amorah</p>
          <div className="mt-3 grid gap-2">
            {(auth.isAuthenticated && auth.user?.role === 'customer' ? [
              { label: `Hello, ${auth.user.fullName?.trim().split(/\s+/)[0] || 'there'}`, to: '/account/profile', icon: <FiUser aria-hidden="true" /> },
              { label: 'My Orders', to: '/account/orders', icon: <FiPackage aria-hidden="true" /> },
              { label: 'Wishlist', to: '/account/wishlist', icon: <FiHeart aria-hidden="true" /> },
              { label: 'Saved Addresses', to: '/account/addresses', icon: <FiUser aria-hidden="true" /> },
            ] : [
              { label: 'Login', to: '/login', icon: <FiUser aria-hidden="true" /> },
              { label: 'Signup', to: '/signup', icon: <FiUser aria-hidden="true" /> },
              { label: 'Wishlist', to: '/wishlist', icon: <FiHeart aria-hidden="true" /> },
            ]).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="amorah-focus flex items-center gap-3 py-2 text-sm font-semibold text-amorah-brown hover:text-amorah-maroon"
                onClick={onClose}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {auth.isAuthenticated && auth.user?.role === 'customer' ? (
              <button
                type="button"
                className="amorah-focus flex items-center gap-3 py-2 text-left text-sm font-semibold text-amorah-brown hover:text-amorah-maroon disabled:opacity-60"
                disabled={loggingOut}
                onClick={logout}
              >
                <FiUser aria-hidden="true" />
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            ) : null}
          </div>
        </div>

        <p className="mt-auto border-t border-amorah-border pt-6 text-sm leading-6 text-amorah-brown">
          Secure online payment with Razorpay.
        </p>
      </aside>
    </div>
  );
}

MobileMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MobileMenu;
