import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiUser } from 'react-icons/fi';
import { selectAuth } from '../../store/slices/authSlice.js';

const iconClassName =
  'amorah-focus group relative inline-flex h-10 w-10 shrink-0 items-center justify-center text-[1.15rem] text-amorah-black transition-colors duration-200 hover:bg-amorah-light hover:text-amorah-maroon';

function AccountMenu() {
  const { user, isAuthenticated } = useSelector(selectAuth);
  const location = useLocation();
  const isCustomer = isAuthenticated && user?.role === 'customer';

  return (
    <Link
      to={isCustomer ? '/account' : '/login'}
      state={isCustomer ? undefined : { from: location }}
      className={iconClassName}
      aria-label={isCustomer ? 'View account' : 'Login'}
      title={isCustomer ? 'View account' : 'Login'}
    >
      <FiUser aria-hidden="true" strokeWidth={1.7} />
    </Link>
  );
}

export default AccountMenu;
