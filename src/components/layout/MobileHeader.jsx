import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiMenu, FiSearch, FiShoppingBag, FiUser } from 'react-icons/fi';
import PropTypes from 'prop-types';
import BrandLogo from './BrandLogo.jsx';
import IconButton from '../common/IconButton.jsx';
import { selectAuth } from '../../store/slices/authSlice.js';

function CountIconButton({ label, count, children, onClick }) {
  return (
    <div className="relative">
      <button
        type="button"
        className="amorah-focus inline-flex h-9 w-9 items-center justify-center border border-transparent text-base text-amorah-black transition hover:bg-amorah-light hover:text-amorah-maroon"
        aria-label={label}
        title={label}
        onClick={onClick}
      >
        {children}
      </button>
      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-amorah-maroon px-1 text-[10px] font-semibold text-amorah-white">
        {count}
      </span>
    </div>
  );
}

CountIconButton.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

function MobileHeader({ onMenuOpen, onSearchOpen, onCartOpen, cartCount = 0 }) {
  const auth = useSelector(selectAuth);
  const location = useLocation();
  const isCustomer = auth.isAuthenticated && auth.user?.role === 'customer';

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1 bg-amorah-white px-3 py-3 min-[380px]:gap-3 min-[380px]:px-4 lg:hidden">
      <IconButton label="Open menu" variant="ghost" size="sm" onClick={onMenuOpen}>
        <FiMenu aria-hidden="true" />
      </IconButton>

      <BrandLogo size="sm" className="min-w-0 justify-self-center [&_img]:w-24 min-[380px]:[&_img]:w-28 sm:[&_img]:w-32" />

      <div className="flex items-center gap-0 min-[380px]:gap-1">
        <IconButton label="Open search" variant="ghost" size="sm" onClick={onSearchOpen}>
          <FiSearch aria-hidden="true" />
        </IconButton>
        <Link
          to={isCustomer ? '/account' : '/login'}
          state={isCustomer ? undefined : { from: location }}
          className="amorah-focus inline-flex h-9 w-9 items-center justify-center text-base text-amorah-black transition hover:bg-amorah-light hover:text-amorah-maroon"
          aria-label={isCustomer ? 'View account' : 'Login'}
          title={isCustomer ? 'View account' : 'Login'}
        >
          <FiUser aria-hidden="true" />
        </Link>
        <CountIconButton label="Open cart" count={cartCount} onClick={onCartOpen}>
          <FiShoppingBag aria-hidden="true" />
        </CountIconButton>
      </div>
    </div>
  );
}

MobileHeader.propTypes = {
  onMenuOpen: PropTypes.func.isRequired,
  onSearchOpen: PropTypes.func.isRequired,
  onCartOpen: PropTypes.func.isRequired,
  cartCount: PropTypes.number,
};

export default MobileHeader;
