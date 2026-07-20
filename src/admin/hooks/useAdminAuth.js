import PropTypes from 'prop-types';
import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAdminMe, loginAdmin, logoutAdmin } from '../services/adminAuthService.js';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const refreshAdmin = useCallback(async () => {
    setStatus('loading');
    setError('');

    try {
      const adminUser = await getAdminMe();
      setUser(adminUser);
      setStatus('authenticated');
      return adminUser;
    } catch (requestError) {
      setUser(null);
      setStatus(requestError.status === 403 ? 'forbidden' : 'unauthenticated');
      setError(requestError.message || 'Unable to verify admin access.');
      return null;
    }
  }, []);

  useEffect(() => {
    refreshAdmin();
  }, [refreshAdmin]);

  const signIn = useCallback(async (credentials) => {
    setStatus('loading');
    setError('');

    try {
      const adminUser = await loginAdmin(credentials);
      setUser(adminUser);
      setStatus('authenticated');
      return adminUser;
    } catch (requestError) {
      setUser(null);
      setStatus(requestError.status === 403 ? 'forbidden' : 'unauthenticated');
      setError(requestError.message || 'Unable to login as admin.');
      throw requestError;
    }
  }, []);

  const signOut = useCallback(async () => {
    await logoutAdmin();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      isLoading: status === 'loading',
      isAdmin: user?.role === 'admin',
      signIn,
      signOut,
      refreshAdmin,
    }),
    [error, refreshAdmin, signIn, signOut, status, user],
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
