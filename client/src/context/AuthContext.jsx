import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { api, setAccessToken } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = async () => {
    try {
      const refreshRes = await api.post('/auth/refresh');
      setAccessToken(refreshRes.data.accessToken);
      const meRes = await api.get('/users/me');
      setUser(meRes.data);
    } catch (error) {
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const login = async (payload) => {
    const res = await api.post('/auth/login', payload);
    setAccessToken(res.data.accessToken);
    const meRes = await api.get('/users/me');
    setUser(meRes.data);
    toast.success('Welcome back');
  };

  const register = async (payload) => {
    await api.post('/auth/register', payload);
    toast.success('Registration successful. Please login.');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
      toast.success('Logged out');
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      setUser,
      login,
      register,
      logout,
      refreshProfile: async () => {
        const res = await api.get('/users/me');
        setUser(res.data);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
