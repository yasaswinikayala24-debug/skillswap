import React, { createContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load user profile on initial app render or token change
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await authAPI.getMe(storedToken);
          if (response.success && response.data) {
            setUser(response.data);
            setToken(storedToken);
          } else {
            // Token invalid or user not found
            logout();
          }
        } catch (error) {
          console.error('Failed to restore session:', error.message);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const response = await authAPI.register({ name, email, password });
      return response;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const response = await authAPI.login({ email, password });
      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        setUser(response.data);
      }
      return response;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // Ignore logout API failure
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setAuthError(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await userAPI.updateProfile(profileData, token);
      if (response.success && response.data) {
        setUser(response.data);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    authError,
    register,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
