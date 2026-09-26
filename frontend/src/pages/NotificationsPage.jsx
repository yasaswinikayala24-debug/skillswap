import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  MessageSquare,
  Calendar,
  UserCheck,
  UserX,
  Send,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const NotificationsPage = () => {
  const { token, fetchBadgeCounts } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await notificationAPI.getNotifications(1, 30, token);
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationAPI.markRead(id, token);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      fetchBadgeCounts(token);
    } catch (err) {
      console.error('Failed to mark read:', err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      fetchBadgeCounts(token);
    } catch (err) {
      console.error('Failed to mark all read:', err.message);
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      handleMarkAsRead(notif._id);
    }

    if (notif.type === 'new_message') {
      navigate('/chat');
    } else if (notif.type === 'exchange_request' || notif.type === 'request_accepted' || notif.type === 'request_rejected') {
      navigate('/requests');
    } else if (notif.type.startsWith('session_')) {
      navigate('/my-sessions');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_message':
        return <MessageSquare className="w-5 h-5 text-purple-400" />;
      case 'exchange_request':
        return <Send className="w-5 h-5 text-indigo-400" />;
      case 'request_accepted':
        return <UserCheck className="w-5 h-5 text-emerald-400" />;
      case 'request_rejected':
        return <UserX className="w-5 h-5 text-red-400" />;
      case 'session_created':
      case 'session_updated':
      case 'session_cancelled':
        return <Calendar className="w-5 h-5 text-amber-400" />;
      default:
        return <Bell className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-400">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              <p className="text-sm text-slate-400">Real-time alerts for messages, requests, and scheduled sessions</p>
            </div>
          </div>

          {notifications.some((n) => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 font-medium text-xs rounded-xl border border-slate-700 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <LoadingSpinner />
            <p className="mt-3 text-sm">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <Bell className="w-12 h-12 text-slate-700 mx-auto" />
            <h3 className="text-lg font-bold text-white">No notifications yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When someone sends you a message, accepts a skill exchange, or schedules a session, your alerts will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-4 ${
                  !notif.read
                    ? 'bg-purple-900/15 border-purple-500/30 hover:border-purple-500/50 shadow-md'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Icon */}
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 flex-shrink-0">
                  {getNotificationIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white truncate">{notif.title}</h4>
                    <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                </div>

                {/* Unread indicator */}
                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
