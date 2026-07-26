import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FiGrid, FiLayers, FiLogOut, FiPackage, FiShoppingBag, FiTag } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { getAdminOrderStats } from '../services/adminOrderService.js';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: FiGrid, end: true },
  { label: 'Orders', to: '/admin/orders', icon: FiPackage },
  { label: 'Categories', to: '/admin/categories', icon: FiLayers },
  { label: 'Products', to: '/admin/products', icon: FiTag },
];

function AdminSidebar({ onLogout }) {
  const [orderCount, setOrderCount] = useState(0);
  useEffect(() => {
    getAdminOrderStats().then((stats) => setOrderCount(stats.pendingBadge || 0)).catch(() => {});
  }, []);
  const baseClass =
    'flex min-h-11 items-center gap-3 px-4 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-[#672F3B]';

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-[#DED2C5] bg-[#FFFDF8] lg:sticky lg:top-0 lg:block">
      <div className="flex h-full flex-col p-5">
        <div className="border-b border-[#DED2C5] pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#672F3B]">Amorah</p>
          <p className="mt-2 font-heading text-3xl font-semibold text-[#302925]">Admin</p>
        </div>
        <nav className="mt-6 space-y-2" aria-label="Admin navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${baseClass} ${isActive ? 'bg-[#672F3B] text-white' : 'text-[#302925] hover:bg-[#F3ECE3]'}`
                }
              >
                <Icon aria-hidden="true" />
                {item.label}
                {item.label === 'Orders' && orderCount > 0 ? (
                  <span className="ml-auto rounded-full bg-[#B9684B] px-2 py-0.5 text-xs text-white">{orderCount}</span>
                ) : null}
              </NavLink>
            );
          })}
          <a className={`${baseClass} text-[#302925] hover:bg-[#F3ECE3]`} href="/" target="_blank" rel="noreferrer">
            <FiShoppingBag aria-hidden="true" />
            View Store
          </a>
        </nav>
        <div className="mt-auto space-y-2 border-t border-[#DED2C5] pt-5">
          <button
            type="button"
            onClick={onLogout}
            className={`${baseClass} w-full text-left text-[#672F3B] hover:bg-[#F3ECE3]`}
          >
            <FiLogOut aria-hidden="true" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

AdminSidebar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default AdminSidebar;
