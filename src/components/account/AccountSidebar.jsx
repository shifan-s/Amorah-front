import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiHeart, FiHome, FiLogOut, FiMapPin, FiPackage, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { logoutCustomer } from '../../services/authService.js';
import { clearAuthUser } from '../../store/slices/authSlice.js';
import { switchToGuestCart } from '../../store/slices/cartSlice.js';
import { loadCartState } from '../../utils/storage.js';

const accountLinks = [
  { label: 'Dashboard', to: '/account', icon: <FiHome aria-hidden="true" /> },
  { label: 'Profile', to: '/account/profile', icon: <FiUser aria-hidden="true" /> },
  { label: 'Orders', to: '/account/orders', icon: <FiPackage aria-hidden="true" /> },
  { label: 'Addresses', to: '/account/addresses', icon: <FiMapPin aria-hidden="true" /> },
  { label: 'Wishlist', to: '/account/wishlist', icon: <FiHeart aria-hidden="true" /> },
];

function AccountSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
      await logoutCustomer();
    } catch {
      toast.error('Session logout could not be confirmed, clearing local session.');
    } finally {
      dispatch(clearAuthUser());
      dispatch(switchToGuestCart(loadCartState()));
      toast.success('Logged out');
      navigate('/login');
    }
  };

  return (
    <aside className="bg-amorah-white p-4 shadow-[0_18px_45px_rgba(48,41,37,0.05)]">
      <nav aria-label="Account navigation">
        <select
          className="lg:hidden"
          aria-label="Account section"
          value={location.pathname}
          onChange={(event) => navigate(event.target.value)}
        >
          {accountLinks.map((link) => (
            <option key={link.to} value={link.to}>
              {link.label}
            </option>
          ))}
        </select>
        <div className="hidden space-y-1 lg:block">
          {accountLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/account'}
              className={({ isActive }) =>
                `amorah-focus flex items-center gap-3 px-4 py-3 text-sm font-semibold ${
                  isActive ? 'bg-amorah-maroon text-amorah-white' : 'text-amorah-brown hover:bg-amorah-light hover:text-amorah-maroon'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            className="amorah-focus flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-amorah-brown hover:bg-amorah-light hover:text-amorah-maroon"
            onClick={logout}
          >
            <FiLogOut aria-hidden="true" />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default AccountSidebar;
