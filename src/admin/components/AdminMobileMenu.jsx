import PropTypes from 'prop-types';
import { FiGrid, FiLayers, FiLogOut, FiPackage, FiShoppingBag, FiTag, FiX } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

function AdminMobileMenu({ open, onClose, onLogout }) {
  if (!open) {
    return null;
  }

  const itemClass = 'flex min-h-12 items-center gap-3 border-b border-[#DED2C5] px-5 text-sm font-semibold text-[#302925]';

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button type="button" className="absolute inset-0 bg-[#302925]/45" onClick={onClose} aria-label="Close admin menu" />
      <div className="absolute right-0 top-0 h-full w-[min(20rem,88vw)] border-l border-[#DED2C5] bg-[#FFFDF8]">
        <div className="flex items-center justify-between border-b border-[#DED2C5] p-5">
          <p className="font-heading text-2xl font-semibold text-[#302925]">Admin</p>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center border border-[#DED2C5] text-[#302925] outline-none focus-visible:ring-2 focus-visible:ring-[#672F3B]"
            aria-label="Close admin menu"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile admin navigation">
          <NavLink to="/admin" end className={itemClass} onClick={onClose}>
            <FiGrid aria-hidden="true" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/orders" className={itemClass} onClick={onClose}>
            <FiPackage aria-hidden="true" />
            Orders
          </NavLink>
          <NavLink to="/admin/categories" className={itemClass} onClick={onClose}>
            <FiLayers aria-hidden="true" />
            Categories
          </NavLink>
          <NavLink to="/admin/products" className={itemClass} onClick={onClose}>
            <FiTag aria-hidden="true" />
            Products
          </NavLink>
          <a href="/" target="_blank" rel="noreferrer" className={itemClass} onClick={onClose}>
            <FiShoppingBag aria-hidden="true" />
            View Store
          </a>
          <button type="button" onClick={onLogout} className={`${itemClass} w-full text-left text-[#672F3B]`}>
            <FiLogOut aria-hidden="true" />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}

AdminMobileMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default AdminMobileMenu;
