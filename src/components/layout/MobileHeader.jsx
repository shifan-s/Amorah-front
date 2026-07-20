import { FiMenu, FiSearch, FiShoppingBag } from 'react-icons/fi';
import PropTypes from 'prop-types';
import BrandLogo from './BrandLogo.jsx';
import IconButton from '../common/IconButton.jsx';

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
  return (
    <div className="flex items-center justify-between gap-3 bg-amorah-white px-4 py-3 lg:hidden">
      <IconButton label="Open menu" variant="ghost" size="sm" onClick={onMenuOpen}>
        <FiMenu aria-hidden="true" />
      </IconButton>

      <BrandLogo size="sm" />

      <div className="flex items-center gap-1">
        <IconButton label="Open search" variant="ghost" size="sm" onClick={onSearchOpen}>
          <FiSearch aria-hidden="true" />
        </IconButton>
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
