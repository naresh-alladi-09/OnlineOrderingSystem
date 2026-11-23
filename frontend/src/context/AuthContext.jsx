import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('feastify_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('feastify_token') || null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  useEffect(() => {
    if (token) {
      api.getProfile()
        .then((profile) => {
          setUser(profile);
          localStorage.setItem('feastify_user', JSON.stringify(profile));
        })
        .catch(() => {
          // Token expired or invalid
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    setUser(data);
    setToken(data.token);
    localStorage.setItem('feastify_token', data.token);
    localStorage.setItem('feastify_user', JSON.stringify(data));
    setAuthModal({ isOpen: false, mode: 'login' });
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    setUser(data);
    setToken(data.token);
    localStorage.setItem('feastify_token', data.token);
    localStorage.setItem('feastify_user', JSON.stringify(data));
    setAuthModal({ isOpen: false, mode: 'login' });
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('feastify_token');
    localStorage.removeItem('feastify_user');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const isAdmin = user && (user.role === 'admin' || user.role === 'restaurant_owner');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        login,
        register,
        logout,
        authModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

