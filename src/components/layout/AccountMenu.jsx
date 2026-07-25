import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiChevronDown, FiHeart, FiLogOut, FiMapPin, FiPackage, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { logoutCustomer } from '../../services/authService.js';
import { clearAuthUser, selectAuth } from '../../store/slices/authSlice.js';
import { switchToGuestCart } from '../../store/slices/cartSlice.js';
import { loadCartState } from '../../utils/storage.js';

const links = [
  { label: 'My Profile', to: '/account/profile', icon: FiUser },
  { label: 'My Orders', to: '/account/orders', icon: FiPackage },
  { label: 'Wishlist', to: '/account/wishlist', icon: FiHeart },
  { label: 'Saved Addresses', to: '/account/addresses', icon: FiMapPin },
];

function AccountMenu() {
  const { user, isAuthenticated } = useSelector(selectAuth);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const rootRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  if (!isAuthenticated || user?.role !== 'customer') {
    return (
      <div className="flex items-center gap-3 text-sm font-semibold">
        <Link className="amorah-focus text-amorah-black hover:text-amorah-maroon" to="/login">Login</Link>
        <Link className="amorah-focus text-amorah-black hover:text-amorah-maroon" to="/signup">Signup</Link>
      </div>
    );
  }

  const firstName = user.fullName?.trim().split(/\s+/)[0] || 'there';

  const logout = async () => {
    setLoggingOut(true);
    try {
      await logoutCustomer();
    } catch {
      toast.error('Session logout could not be confirmed. Your local session was cleared.');
    } finally {
      dispatch(clearAuthUser());
      dispatch(switchToGuestCart(loadCartState()));
      setOpen(false);
      setLoggingOut(false);
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="amorah-focus flex min-h-10 items-center gap-2 px-2 text-sm font-semibold text-amorah-black hover:text-amorah-maroon"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        Hello, {firstName}
        <FiChevronDown aria-hidden="true" className={open ? 'rotate-180' : ''} />
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 border border-amorah-border bg-amorah-white p-2 shadow-[0_14px_36px_rgba(48,41,37,0.12)]" role="menu">
          {links.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              role="menuitem"
              className="amorah-focus flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-amorah-brown hover:bg-amorah-light hover:text-amorah-maroon"
              onClick={() => setOpen(false)}
            >
              <Icon aria-hidden="true" />
              {label}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            disabled={loggingOut}
            className="amorah-focus flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold text-amorah-brown hover:bg-amorah-light hover:text-amorah-maroon disabled:opacity-60"
            onClick={logout}
          >
            <FiLogOut aria-hidden="true" />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default AccountMenu;
