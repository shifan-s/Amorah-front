import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import PageLoader from '../common/PageLoader.jsx';
import { selectAuth } from '../../store/slices/authSlice.js';

function ProtectedRoute({ children, loginMessage = '' }) {
  const auth = useSelector(selectAuth);
  const location = useLocation();

  if (auth.status === 'idle' || auth.status === 'loading') {
    return <PageLoader />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location, message: loginMessage }} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  loginMessage: PropTypes.string,
};

export default ProtectedRoute;
