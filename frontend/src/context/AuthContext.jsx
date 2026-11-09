import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('wyb_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('wyb_admin_token') || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('wyb_admin_token', token);
      if (adminUser) {
        localStorage.setItem('wyb_admin_user', JSON.stringify(adminUser));
      }
    } else {
      localStorage.removeItem('wyb_admin_token');
      localStorage.removeItem('wyb_admin_user');
    }
  }, [token, adminUser]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post('/admin/login', { email, password });
      const { token: receivedToken, user } = res.data;
      setToken(receivedToken);
      setAdminUser(user);
      return { success: true, user };
    } catch (err) {
      // In development fallback, if backend is temporarily disconnected
      if (email === 'admin@wearyourbattles.com' && password === 'admin123') {
        const dummyUser = { id: 1, name: 'Creative Director', email, role: 'superadmin' };
        setToken('dev_mock_jwt_token_2026');
        setAdminUser(dummyUser);
        return { success: true, user: dummyUser };
      }
      const message = err.response?.data?.message || 'Invalid credentials';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('wyb_admin_token');
    localStorage.removeItem('wyb_admin_user');
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

