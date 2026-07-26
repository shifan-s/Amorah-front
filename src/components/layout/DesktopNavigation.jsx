import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiChevronDown } from 'react-icons/fi';
import { selectNavigationCategories } from '../../store/slices/categorySlice.js';

const staticLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?sort=newest' },
  { label: 'About', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
];

function isCottonCategory(category) {
  const name = String(category?.name || '').trim().toLowerCase();
  const slug = String(category?.slug || '').trim().toLowerCase();

  return name === 'cotton' || slug === 'cotton';
}

export function useCustomerNavigationLinks() {
  const categories = useSelector(selectNavigationCategories);

  const categoryLinks = categories
    .filter((category) => !isCottonCategory(category))
    .map((category) => ({
      label: category.name,
      to: `/shop/${category.slug}`,
      children: category.children || [],
    }));

  return {
    links: [
      staticLinks[0],
      staticLinks[1],
      staticLinks[2],
      ...categoryLinks,
      staticLinks[3],
      staticLinks[4],
    ],
  };
}

function isNavigationActive(link, location) {
  const [pathname, queryString] = link.to.split('?');

  if (queryString) {
    return (
      location.pathname === pathname &&
      location.search === `?${queryString}`
    );
  }

  if (pathname === '/') {
    return location.pathname === '/';
  }

  if (pathname === '/shop') {
    return location.pathname === '/shop' && !location.search;
  }

  return (
    location.pathname === pathname ||
    location.pathname.startsWith(`${pathname}/`)
  );
}

function getMainLinkClasses(isActive) {
  return [
    'amorah-focus',
    'group/link',
    'relative',
    'inline-flex',
    'items-center',
    'gap-1.5',
    'whitespace-nowrap',
    'py-2',
    'text-[0.7rem]',
    'font-semibold',
    'uppercase',
    'tracking-[0.16em]',
    'transition-colors',
    'duration-200',
    'after:absolute',
    'after:bottom-0',
    'after:left-0',
    'after:h-px',
    'after:bg-amorah-maroon',
    'after:transition-all',
    'after:duration-300',
    isActive
      ? 'text-amorah-maroon after:w-full'
      : 'text-amorah-brown after:w-0 hover:text-amorah-maroon hover:after:w-full',
  ].join(' ');
}

function DropdownPanel({ children, align = 'center' }) {
  const alignment =
    align === 'right'
      ? 'right-0'
      : 'left-1/2 -translate-x-1/2';

  return (
    <div
      className={`pointer-events-none invisible absolute top-full z-50 min-w-60 pt-3 opacity-0 transition-all duration-200 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 ${alignment}`}
    >
      <div className="border border-amorah-border/90 bg-amorah-white p-2 shadow-[0_18px_45px_rgba(52,30,25,0.10)]">
        {children}
      </div>
    </div>
  );
}

function DropdownLink({ to, children }) {
  return (
    <Link
      to={to}
      className="amorah-focus flex min-h-11 items-center px-4 text-sm font-medium text-amorah-brown transition-colors duration-200 hover:bg-amorah-light hover:text-amorah-maroon"
    >
      {children}
    </Link>
  );
}

function NavigationLink({ link }) {
  const location = useLocation();
  const isActive = isNavigationActive(link, location);
  const hasChildren = Boolean(link.children?.length);

  if (!hasChildren) {
    return (
      <Link
        to={link.to}
        className={getMainLinkClasses(isActive)}
        aria-current={isActive ? 'page' : undefined}
      >
        {link.label}
      </Link>
    );
  }

  const categorySlug = link.to.split('/').filter(Boolean).pop();

  return (
    <div className="group relative">
      <Link
        to={link.to}
        className={getMainLinkClasses(isActive)}
        aria-current={isActive ? 'page' : undefined}
      >
        <span>{link.label}</span>
        <FiChevronDown
          aria-hidden="true"
          className="text-sm transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
        />
      </Link>

      <DropdownPanel>
        <DropdownLink to={link.to}>View all {link.label}</DropdownLink>

        <div className="my-1 border-t border-amorah-border/70" />

        {link.children.map((subcategory) => (
          <DropdownLink
            key={subcategory.id || subcategory.slug}
            to={`/shop/${categorySlug}?subcategory=${subcategory.slug}`}
          >
            {subcategory.name}
          </DropdownLink>
        ))}
      </DropdownPanel>
    </div>
  );
}

function MoreNavigation({ links }) {
  const location = useLocation();
  const isActive = links.some((link) => isNavigationActive(link, location));

  return (
    <div className="group relative">
      <button
        type="button"
        className={getMainLinkClasses(isActive)}
        aria-haspopup="true"
      >
        <span>More</span>
        <FiChevronDown
          aria-hidden="true"
          className="text-sm transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
        />
      </button>

      <DropdownPanel align="right">
        {links.map((link) => (
          <DropdownLink key={link.to} to={link.to}>
            {link.label}
          </DropdownLink>
        ))}
      </DropdownPanel>
    </div>
  );
}

function DesktopNavigation({ className = '' }) {
  const { links } = useCustomerNavigationLinks();

  const homeLink = links.find((link) => link.to === '/');
  const shopLink = links.find((link) => link.to === '/shop');
  const newArrivalsLink = links.find(
    (link) => link.to === '/shop?sort=newest',
  );
  const aboutLink = links.find((link) => link.to === '/about');
  const contactLink = links.find((link) => link.to === '/contact');

  const categoryLinks = links.filter(
    (link) =>
      link.to !== '/' &&
      link.to !== '/shop' &&
      link.to !== '/shop?sort=newest' &&
      link.to !== '/about' &&
      link.to !== '/contact',
  );

  const visibleLinks = [
    homeLink,
    shopLink,
    newArrivalsLink,
    ...categoryLinks.slice(0, 2),
    aboutLink,
    contactLink,
  ].filter(Boolean);

  const overflowLinks = categoryLinks.slice(2);

  return (
    <nav
      className={`hidden min-w-0 items-center gap-4 lg:flex xl:gap-6 ${className}`}
      aria-label="Primary navigation"
    >
      {visibleLinks.map((link) => (
        <NavigationLink key={link.to} link={link} />
      ))}

      {overflowLinks.length > 0 ? (
        <MoreNavigation links={overflowLinks} />
      ) : null}
    </nav>
  );
}

export { staticLinks as desktopNavigationLinks };
export default DesktopNavigation;
