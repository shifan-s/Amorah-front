import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import useAdminAuth from '../hooks/useAdminAuth.js';

function ProtectedAdminRoute({ children }) {
  const { isAdmin, isLoading, status } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF6EE] px-4 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#672F3B]">Admin access</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold text-[#302925]">Checking permissions</h1>
        </div>
      </main>
    );
  }

  if (status === 'forbidden') {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  return children;
}

ProtectedAdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedAdminRoute;
