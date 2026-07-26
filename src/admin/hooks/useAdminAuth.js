import PropTypes from 'prop-types';
import { createContext, createElement, useCallback, useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthUser, selectAuth, setAuthStatus, setAuthUser } from '../../store/slices/authSlice.js';
import { loginAdmin, logoutAdmin } from '../services/adminAuthService.js';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(clearAuthUser());
    };

    window.addEventListener('amorah:admin-unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('amorah:admin-unauthorized', handleUnauthorized);
    };
  }, [dispatch]);

  const signIn = useCallback(async (credentials) => {
    dispatch(setAuthStatus('loading'));

    try {
      const adminUser = await loginAdmin(credentials);
      dispatch(setAuthUser(adminUser));
      return adminUser;
    } catch (requestError) {
      dispatch(clearAuthUser());
      throw requestError;
    }
  }, [dispatch]);

  const signOut = useCallback(async () => {
    try {
      await logoutAdmin();
    } finally {
      dispatch(clearAuthUser());
    }
  }, [dispatch]);

  const status =
    auth.status === 'idle' || auth.status === 'loading'
      ? 'loading'
      : auth.isAuthenticated && auth.user?.role !== 'admin'
        ? 'forbidden'
        : auth.isAuthenticated
          ? 'authenticated'
          : 'unauthenticated';

  const value = useMemo(
    () => ({
      user: auth.user,
      status,
      isLoading: status === 'loading',
      isAdmin: auth.user?.role === 'admin',
      signIn,
      signOut,
    }),
    [auth.user, signIn, signOut, status],
  );

  return createElement(AdminAuthContext.Provider, { value }, children);
}

AdminAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  }

  return context;
}
