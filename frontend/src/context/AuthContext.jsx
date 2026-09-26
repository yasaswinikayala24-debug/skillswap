import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI, userAPI, notificationAPI, exchangeAPI, conversationAPI } from '../services/api';
import socketService from '../services/socketService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Unread Counts for Navbar Badges
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const fetchBadgeCounts = useCallback(async (authToken) => {
    const t = authToken || token || localStorage.getItem('token');
    if (!t) return;

    try {
      const [notifRes, reqRes, convRes] = await Promise.all([
        notificationAPI.getUnreadCount(t).catch(() => ({ count: 0 })),
        exchangeAPI.getPendingCount(t).catch(() => ({ count: 0 })),
        conversationAPI.getConversations(t).catch(() => ({ data: [] }))
      ]);

      if (notifRes.count !== undefined) setUnreadNotificationsCount(notifRes.count);
      if (reqRes.count !== undefined) setPendingRequestsCount(reqRes.count);

      if (convRes.data && Array.isArray(convRes.data)) {
        const totalUnreadMsgs = convRes.data.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
        setUnreadMessagesCount(totalUnreadMsgs);
      }
    } catch (err) {
      console.warn('Failed to fetch badge counts:', err.message);
    }
  }, [token]);

  // Connect socket and listen for real-time notifications/messages
  useEffect(() => {
    if (user && token) {
      const socket = socketService.connect();

      if (socket) {
        fetchBadgeCounts(token);

        const handleSocketNotification = () => {
          setUnreadNotificationsCount((prev) => prev + 1);
          fetchBadgeCounts(token);
        };

        const handleSocketMessage = () => {
          setUnreadMessagesCount((prev) => prev + 1);
          fetchBadgeCounts(token);
        };

        socketService.on('notification', handleSocketNotification);
        socketService.on('receive_message', handleSocketMessage);

        return () => {
          socketService.off('notification', handleSocketNotification);
          socketService.off('receive_message', handleSocketMessage);
        };
      }
    } else {
      socketService.disconnect();
    }
  }, [user, token, fetchBadgeCounts]);

  // Load user profile on initial app render
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
      // Ignore API logout error
    } finally {
      socketService.disconnect();
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setAuthError(null);
      setUnreadNotificationsCount(0);
      setUnreadMessagesCount(0);
      setPendingRequestsCount(0);
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
    unreadNotificationsCount,
    unreadMessagesCount,
    pendingRequestsCount,
    fetchBadgeCounts,
    register,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
