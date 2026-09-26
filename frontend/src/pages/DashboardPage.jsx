import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { userAPI, matchAPI, exchangeAPI, conversationAPI, sessionAPI, notificationAPI } from '../services/api';
import MetricCard from '../components/MetricCard';
import {
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Compass,
  Sliders,
  Inbox,
  Repeat,
  MessageSquare,
  Calendar,
  Bell
} from 'lucide-react';

const DashboardPage = () => {
  const { user, token } = useContext(AuthContext);

  const [teachCount, setTeachCount] = useState(0);
  const [learnCount, setLearnCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeExchangeCount, setActiveExchangeCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [upcomingSessionsCount, setUpcomingSessionsCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    if (token) {
      fetchDashboardStats();
    }
  }, [token]);

  const fetchDashboardStats = async () => {
    try {
      const [skillsRes, matchRes, pendingRes, activeRes, convRes, sessionRes, notifRes] = await Promise.all([
        userAPI.getMySkills(token).catch(() => ({ success: false })),
        matchAPI.getMatches({}, token).catch(() => ({ success: false })),
        exchangeAPI.getPendingCount(token).catch(() => ({ success: false })),
        exchangeAPI.getActiveExchanges(token).catch(() => ({ success: false })),
        conversationAPI.getConversations(token).catch(() => ({ success: false })),
        sessionAPI.getSessions(token).catch(() => ({ success: false })),
        notificationAPI.getUnreadCount(token).catch(() => ({ success: false }))
      ]);

      if (skillsRes.success && skillsRes.data) {
        setTeachCount(skillsRes.data.skillsToTeach?.length || 0);
        setLearnCount(skillsRes.data.skillsToLearn?.length || 0);
      }
      if (matchRes.success && matchRes.data) {
        setMatchCount(matchRes.data.length || 0);
      }
      if (pendingRes.success) {
        setPendingCount(pendingRes.count || 0);
      }
      if (activeRes.success && activeRes.data) {
        setActiveExchangeCount(activeRes.data.length || 0);
      }
      if (convRes.success && convRes.data) {
        const totalUnreadMsgs = convRes.data.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
        setUnreadMessagesCount(totalUnreadMsgs);
      }
      if (sessionRes.success && sessionRes.data) {
        const upcoming = sessionRes.data.filter(
          (s) => s.status === 'scheduled' && new Date(s.scheduledAt) >= new Date()
        );
        setUpcomingSessionsCount(upcoming.length);
      }
      if (notifRes.success) {
        setUnreadNotificationsCount(notifRes.count || 0);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 4 Real-time Chat, Sessions & Notifications</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, {user?.name || 'Swapper'} 👋
            </h1>
            <p className="mt-2 text-slate-300 text-base max-w-xl">
              Connect in real time with accepted skill exchange partners, schedule learning sessions, and manage your skill progress.
            </p>
          </div>

          {/* Banner Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/matches"
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find Matches</span>
            </Link>

            <Link
              to="/chat"
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-all shrink-0"
            >
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Open Chat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link
            to="/matches"
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between group"
          >
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 w-fit group-hover:scale-110 transition-transform mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xs group-hover:text-purple-300">Find Matches</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{matchCount} matched</p>
            </div>
          </Link>

          <Link
            to="/chat"
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between group"
          >
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 w-fit group-hover:scale-110 transition-transform mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xs group-hover:text-indigo-300">Open Chat</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{unreadMessagesCount} unread</p>
            </div>
          </Link>

          <Link
            to="/my-sessions"
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between group"
          >
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 w-fit group-hover:scale-110 transition-transform mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xs group-hover:text-amber-300">Schedule Session</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{upcomingSessionsCount} upcoming</p>
            </div>
          </Link>

          <Link
            to="/requests"
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between group"
          >
            <div className="p-3 rounded-xl bg-red-500/20 text-red-400 w-fit group-hover:scale-110 transition-transform mb-3">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xs group-hover:text-red-300">View Requests</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{pendingCount} pending</p>
            </div>
          </Link>

          <Link
            to="/my-sessions"
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between group"
          >
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit group-hover:scale-110 transition-transform mb-3">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xs group-hover:text-emerald-300">View Sessions</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{upcomingSessionsCount} scheduled</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Dynamic Statistics Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Real-Time Platform Metrics</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Potential Matches"
            value={matchCount}
            icon={Sparkles}
            badgeText="Algorithm"
            color="purple"
          />
          <MetricCard
            title="Pending Requests"
            value={pendingCount}
            icon={Inbox}
            badgeText="Requests"
            color="red"
          />
          <MetricCard
            title="Active Exchanges"
            value={activeExchangeCount}
            icon={Repeat}
            badgeText="Partners"
            color="emerald"
          />
          <MetricCard
            title="Unread Messages"
            value={unreadMessagesCount}
            icon={MessageSquare}
            badgeText="Socket.IO"
            color="indigo"
          />
          <MetricCard
            title="Upcoming Sessions"
            value={upcomingSessionsCount}
            icon={Calendar}
            badgeText="Calendar"
            color="amber"
          />
          <MetricCard
            title="Notifications"
            value={unreadNotificationsCount}
            icon={Bell}
            badgeText="Alerts"
            color="sky"
          />
        </div>
      </div>

      {/* Feature Section Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Real-Time 1-on-1 Chat</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Message accepted skill exchange partners instantly with typing indicators, online status, and unread counts.
            </p>
          </div>
          <Link
            to="/chat"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center space-x-1 pt-3 border-t border-slate-800"
          >
            <span>Open Chat Room</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Exchange Sessions</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Schedule, reschedule, cancel, and complete learning appointments with your exchange partners.
            </p>
          </div>
          <Link
            to="/my-sessions"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 pt-3 border-t border-slate-800"
          >
            <span>Manage Sessions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Instant Notifications</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Stay up-to-date with instant socket notifications when partners message you or schedule sessions.
            </p>
          </div>
          <Link
            to="/notifications"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 pt-3 border-t border-slate-800"
          >
            <span>View Alerts ({unreadNotificationsCount})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
