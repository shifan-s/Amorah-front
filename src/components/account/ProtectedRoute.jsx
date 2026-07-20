import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import PageLoader from '../common/PageLoader.jsx';
import { selectAuth } from '../../store/slices/authSlice.js';
import { getLocationPath } from '../../utils/authRedirect.js';

function ProtectedRoute({ children, loginMessage = '' }) {
  const auth = useSelector(selectAuth);
  const location = useLocation();

  if (auth.status === 'idle' || auth.status === 'loading') {
    return <PageLoader />;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: getLocationPath(location), message: loginMessage }} />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  loginMessage: PropTypes.string,
};

export default ProtectedRoute;
