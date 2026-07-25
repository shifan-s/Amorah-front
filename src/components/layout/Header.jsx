import { Link } from 'react-router-dom';
import {
  FiHeart,
  FiSearch,
  FiShoppingBag,
  FiUser,
} from 'react-icons/fi';
import PropTypes from 'prop-types';
import BrandLogo from './BrandLogo.jsx';
import DesktopNavigation from './DesktopNavigation.jsx';
import MobileHeader from './MobileHeader.jsx';

const iconClassName =
  'amorah-focus group relative inline-flex h-10 w-10 shrink-0 items-center justify-center text-[1.15rem] text-amorah-black transition-colors duration-200 hover:bg-amorah-light hover:text-amorah-maroon';

function CountBadge({ count }) {
  if (count <= 0) {
    return null;
  }

  const displayCount = count > 99 ? '99+' : count;

  return (
    <span className="absolute right-0.5 top-0.5 flex h-[1.05rem] min-w-[1.05rem] items-center justify-center rounded-full border-2 border-amorah-white bg-amorah-maroon px-0.5 text-[0.55rem] font-bold leading-none text-amorah-white">
      {displayCount}
    </span>
  );
}

CountBadge.propTypes = {
  count: PropTypes.number.isRequired,
};

function HeaderLinkIcon({ to, label, count, children }) {
  return (
    <Link
      to={to}
      className={iconClassName}
      aria-label={label}
      title={label}
    >
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
    <button
      type="button"
      className={iconClassName}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
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

function Header({
  onSearchOpen,
  onMobileMenuOpen,
  onCartOpen,
  wishlistCount = 0,
  cartCount = 0,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-amorah-border/80 bg-amorah-white/95 shadow-[0_1px_12px_rgba(52,30,25,0.035)] backdrop-blur-md">
      <MobileHeader
        onMenuOpen={onMobileMenuOpen}
        onSearchOpen={onSearchOpen}
        onCartOpen={onCartOpen}
        wishlistCount={wishlistCount}
        cartCount={cartCount}
      />

      <div className="hidden lg:block">
        <div className="mx-auto grid h-[4.75rem] max-w-[1600px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 px-7 xl:gap-10 xl:px-12 2xl:px-16">
          <div className="flex min-w-[160px] items-center">
            <BrandLogo size="md" />
          </div>

          <DesktopNavigation className="justify-center" />

          <div className="flex min-w-[160px] items-center justify-end gap-1">
            <HeaderActionIcon
              label="Open search"
              onClick={onSearchOpen}
            >
              <FiSearch aria-hidden="true" strokeWidth={1.7} />
            </HeaderActionIcon>

            <HeaderLinkIcon to="/account" label="View account">
              <FiUser aria-hidden="true" strokeWidth={1.7} />
            </HeaderLinkIcon>

            <HeaderLinkIcon
              to="/wishlist"
              label="View wishlist"
              count={wishlistCount}
            >
              <FiHeart aria-hidden="true" strokeWidth={1.7} />
            </HeaderLinkIcon>

            <HeaderActionIcon
              label="Open cart"
              count={cartCount}
              onClick={onCartOpen}
            >
              <FiShoppingBag aria-hidden="true" strokeWidth={1.7} />
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