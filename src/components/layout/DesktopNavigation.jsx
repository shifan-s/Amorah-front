import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiChevronDown } from 'react-icons/fi';
import { selectCategoryStatus, selectNavigationCategories } from '../../store/slices/categorySlice.js';

const staticLinks = [
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?sort=newest' },
  { label: 'About', to: '/about' },
];

export function useCustomerNavigationLinks() {
  const categories = useSelector(selectNavigationCategories);
  const status = useSelector(selectCategoryStatus);
  const categoryLinks = categories.map((category) => ({
    label: category.name,
    to: `/shop/${category.slug}`,
    children: category.children || [],
  }));

  return {
    loading: status === 'idle' || status === 'loading',
    links: [staticLinks[0], staticLinks[1], ...categoryLinks.slice(0, 4), staticLinks[2]],
  };
}

function NavigationLink({ link }) {
  const hasChildren = link.children?.length > 0;

  if (!hasChildren) {
    return (
      <NavLink
        to={link.to}
        className={({ isActive }) =>
          `amorah-focus whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] transition hover:text-amorah-maroon ${
            isActive ? 'text-amorah-maroon' : 'text-amorah-brown'
          }`
        }
      >
        {link.label}
      </NavLink>
    );
  }

  return (
    <div className="group relative">
      <NavLink
        to={link.to}
        className={({ isActive }) =>
          `amorah-focus inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] transition hover:text-amorah-maroon ${
            isActive ? 'text-amorah-maroon' : 'text-amorah-brown'
          }`
        }
      >
        {link.label}
        <FiChevronDown aria-hidden="true" className="text-sm" />
      </NavLink>
      <div className="invisible absolute left-1/2 top-full z-30 min-w-56 -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="border border-amorah-border bg-amorah-white p-2 shadow-sm">
          <NavLink
            to={link.to}
            className="amorah-focus block px-4 py-3 text-sm font-semibold text-amorah-brown hover:bg-amorah-light hover:text-amorah-maroon"
          >
            View All
          </NavLink>
          {link.children.map((subcategory) => (
            <NavLink
              key={subcategory.id || subcategory.slug}
              to={`/shop/${link.to.split('/').pop()}?subcategory=${subcategory.slug}`}
              className="amorah-focus block px-4 py-3 text-sm font-semibold text-amorah-brown hover:bg-amorah-light hover:text-amorah-maroon"
            >
              {subcategory.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

function MoreNavigation({ links }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="amorah-focus inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-amorah-brown transition hover:text-amorah-maroon"
      >
        More
        <FiChevronDown aria-hidden="true" className="text-sm" />
      </button>
      <div className="invisible absolute right-0 top-full z-30 min-w-56 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="border border-amorah-border bg-amorah-white p-2 shadow-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="amorah-focus block px-4 py-3 text-sm font-semibold text-amorah-brown hover:bg-amorah-light hover:text-amorah-maroon"
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesktopNavigation({ className = '' }) {
  const { links, loading } = useCustomerNavigationLinks();
  const visibleLinks = links.slice(0, 7);
  const overflowLinks = links.slice(7);

  return (
    <nav className={`hidden items-center gap-6 lg:flex ${className}`} aria-label="Primary navigation">
      {loading ? <span className="text-xs font-semibold uppercase tracking-[0.14em] text-amorah-brown">Loading</span> : null}
      {!loading && visibleLinks.map((link) => <NavigationLink key={link.to} link={link} />)}
      {!loading && overflowLinks.length ? <MoreNavigation links={overflowLinks} /> : null}
    </nav>
  );
}

export { staticLinks as desktopNavigationLinks };
export default DesktopNavigation;
