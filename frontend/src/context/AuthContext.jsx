import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('struct_auth_token'));
  const [owner, setOwner] = useState(() => {
    try {
      const saved = localStorage.getItem('struct_auth_owner');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem('struct_auth_token'));
      try {
        const saved = localStorage.getItem('struct_auth_owner');
        setOwner(saved ? JSON.parse(saved) : null);
      } catch {
        setOwner(null);
      }
    };

    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: jwtToken, owner: ownerData } = res.data;

      localStorage.setItem('struct_auth_token', jwtToken);
      localStorage.setItem('struct_auth_owner', JSON.stringify(ownerData));
      setToken(jwtToken);
      setOwner(ownerData);
      return { success: true, owner: ownerData };
    } catch (err) {
      const message = err.response?.data?.message || 'Authentication failed. Please verify credentials.';
      setAuthError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (supplierData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.post('/auth/register', supplierData);
      const { token: jwtToken, owner: ownerData } = res.data;

      localStorage.setItem('struct_auth_token', jwtToken);
      localStorage.setItem('struct_auth_owner', JSON.stringify(ownerData));
      setToken(jwtToken);
      setOwner(ownerData);
      return { success: true, owner: ownerData };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Check required fields.';
      setAuthError(message);
      return { success: false, message, errors: err.response?.data?.errors };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('struct_auth_token');
    localStorage.removeItem('struct_auth_owner');
    setToken(null);
    setOwner(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        owner,
        isAuthenticated: !!token && !!owner,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
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
