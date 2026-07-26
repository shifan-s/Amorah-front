import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageLoader from '../common/PageLoader.jsx';
import { selectAuth } from '../../store/slices/authSlice.js';

function PublicOnlyRoute({ children }) {
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

  return <Navigate to="/" replace />;
}

PublicOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicOnlyRoute;
