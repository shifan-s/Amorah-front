import { Link } from 'react-router-dom';
import { FiHeart, FiSearch, FiShoppingBag, FiUser } from 'react-icons/fi';
import PropTypes from 'prop-types';
import BrandLogo from './BrandLogo.jsx';
import DesktopNavigation from './DesktopNavigation.jsx';
import MobileHeader from './MobileHeader.jsx';
import IconButton from '../common/IconButton.jsx';

const iconClassName =
  'amorah-focus relative inline-flex h-11 w-11 items-center justify-center border border-transparent text-lg text-amorah-black transition hover:bg-amorah-light hover:text-amorah-maroon';

function CountBadge({ count }) {
  return (
    <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center bg-amorah-maroon px-1 text-[10px] font-semibold text-amorah-white">
      {count}
    </span>
  );
}

CountBadge.propTypes = {
  count: PropTypes.number.isRequired,
};

function HeaderLinkIcon({ to, label, count, children }) {
  return (
    <Link to={to} className={iconClassName} aria-label={label} title={label}>
      {children}
      {typeof count === 'number' ? <CountBadge count={count} /> : null}
    </Link>
  );
}

HeaderLinkIcon.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  count: PropTypes.number,
  children: PropTypes.node.isRequired,
};

function HeaderActionIcon({ label, count, children, onClick }) {
  return (
    <button type="button" className={iconClassName} aria-label={label} title={label} onClick={onClick}>
      {children}
      {typeof count === 'number' ? <CountBadge count={count} /> : null}
    </button>
  );
}

HeaderActionIcon.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

function Header({ onSearchOpen, onMobileMenuOpen, onCartOpen, wishlistCount = 0, cartCount = 0 }) {
  return (
    <header className="sticky top-0 z-40 border-b border-amorah-border bg-amorah-white/95 backdrop-blur">
      <MobileHeader
        onMenuOpen={onMobileMenuOpen}
        onSearchOpen={onSearchOpen}
        onCartOpen={onCartOpen}
        wishlistCount={wishlistCount}
        cartCount={cartCount}
      />

      <div className="hidden lg:block">
        <div className="mx-auto grid max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-10 py-4 xl:px-14">
          <DesktopNavigation className="justify-start" />

          <BrandLogo size="md" />

          <div className="flex items-center justify-end gap-2">
            <IconButton label="Open search" variant="ghost" onClick={onSearchOpen}>
              <FiSearch aria-hidden="true" />
            </IconButton>
            <HeaderLinkIcon to="/account" label="View account">
              <FiUser aria-hidden="true" />
            </HeaderLinkIcon>
            <HeaderLinkIcon to="/wishlist" label="View wishlist" count={wishlistCount}>
              <FiHeart aria-hidden="true" />
            </HeaderLinkIcon>
            <HeaderActionIcon label="Open cart" count={cartCount} onClick={onCartOpen}>
              <FiShoppingBag aria-hidden="true" />
            </HeaderActionIcon>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  onSearchOpen: PropTypes.func.isRequired,
  onMobileMenuOpen: PropTypes.func.isRequired,
  onCartOpen: PropTypes.func.isRequired,
  wishlistCount: PropTypes.number,
  cartCount: PropTypes.number,
};

export default Header;
