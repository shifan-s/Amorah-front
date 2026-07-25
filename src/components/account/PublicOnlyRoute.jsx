import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageLoader from '../common/PageLoader.jsx';
import { selectAuth } from '../../store/slices/authSlice.js';

function PublicOnlyRoute({ children, admin = false }) {
  const auth = useSelector(selectAuth);

  if (auth.status === 'idle' || auth.status === 'loading') {
    return <PageLoader />;
  }

  if (!auth.isAuthenticated) {
    return children;
  }

  if (auth.user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to={admin ? '/' : '/'} replace />;
}

PublicOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
  admin: PropTypes.bool,
};

export default PublicOnlyRoute;
