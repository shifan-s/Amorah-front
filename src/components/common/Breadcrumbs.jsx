import { Link } from 'react-router-dom';
import { IoChevronForward } from 'react-icons/io5';
import PropTypes from 'prop-types';

function Breadcrumbs({ items, className = '' }) {
  return (
    <nav className={`text-sm text-amorah-brown ${className}`} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${item.href || index}`} className="flex items-center gap-2">
              {index > 0 ? <IoChevronForward className="text-xs" aria-hidden="true" /> : null}
              {item.href && !isLast ? (
                <Link className="amorah-focus hover:text-amorah-black" to={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    }),
  ).isRequired,
  className: PropTypes.string,
};

export default Breadcrumbs;
