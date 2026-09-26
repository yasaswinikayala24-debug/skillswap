import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Calendar,
  Clock,
  User,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Edit3,
  Check
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import ScheduleSessionModal from '../components/ScheduleSessionModal';
import LoadingSpinner from '../components/LoadingSpinner';

const MySessions = () => {
  const { user, token } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming | completed | cancelled
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await sessionAPI.getSessions(token);
      if (res.success && res.data) {
        setSessions(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Handle Cancel Session
  const handleCancelSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this session?')) return;
    try {
      const res = await sessionAPI.cancelSession(sessionId, token);
      if (res.success) {
        setActionSuccess('Session cancelled successfully');
        fetchSessions();
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel session');
    }
  };

  // Handle Complete Session
  const handleCompleteSession = async (sessionId) => {
    try {
      const res = await sessionAPI.completeSession(sessionId, token);
      if (res.success) {
        setActionSuccess('Session marked as completed!');
        fetchSessions();
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to complete session');
    }
  };

  // Filter sessions by tab
  const upcomingSessions = sessions.filter(
    (s) => s.status === 'scheduled' && new Date(s.scheduledAt) >= new Date()
  );
  const pastScheduledSessions = sessions.filter(
    (s) => s.status === 'scheduled' && new Date(s.scheduledAt) < new Date()
  );
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const cancelledSessions = sessions.filter((s) => s.status === 'cancelled');

  let currentTabSessions = [];
  if (activeTab === 'upcoming') {
    currentTabSessions = [...upcomingSessions, ...pastScheduledSessions];
  } else if (activeTab === 'completed') {
    currentTabSessions = completedSessions;
  } else if (activeTab === 'cancelled') {
    currentTabSessions = cancelledSessions;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-400">
                <Calendar className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white">Skill Exchange Sessions</h1>
            </div>
            <p className="text-sm text-slate-400">
              Schedule, manage, and complete your 1-on-1 skill learning appointments with partners.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingSession(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-purple-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Session</span>
          </button>
        </div>

        {/* Action Success Alert */}
        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-800 space-x-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'upcoming'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upcoming Sessions ({upcomingSessions.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'completed'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed ({completedSessions.length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'cancelled'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cancelled ({cancelledSessions.length})
          </button>
        </div>

        {/* Session List Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <LoadingSpinner />
            <p className="mt-3 text-sm">Loading session schedules...</p>
          </div>
        ) : currentTabSessions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <Calendar className="w-12 h-12 text-slate-700 mx-auto" />
            <h3 className="text-lg font-bold text-white">No {activeTab} sessions</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {activeTab === 'upcoming'
                ? 'You have no upcoming sessions scheduled. Accept an exchange request and click "Schedule Session" to set one up!'
                : `No ${activeTab} sessions found.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTabSessions.map((session) => {
              const isOrganizer = session.organizer?._id === user?._id;
              const partner = isOrganizer ? session.participant : session.organizer;
              const scheduledDateObj = new Date(session.scheduledAt);

              return (
                <div
                  key={session._id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col justify-between transition-all"
                >
                  <div className="space-y-4">
                    {/* Header: Title & Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-white leading-snug">{session.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                          <User className="w-3.5 h-3.5 text-purple-400" />
                          <span>With: <strong className="text-slate-200">{partner?.name || 'Partner'}</strong></span>
                        </p>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          session.status === 'scheduled'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : session.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>

                    {/* Description if any */}
                    {session.description && (
                      <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                        {session.description}
                      </p>
                    )}

                    {/* Meta Date Time & Duration */}
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-semibold">Date & Time</p>
                          <p className="font-semibold">{scheduledDateObj.toLocaleDateString()} {scheduledDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-slate-300">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-semibold">Duration</p>
                          <p className="font-semibold">{session.duration} minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Buttons */}
                  {session.status === 'scheduled' && (
                    <div className="flex items-center justify-end space-x-2 pt-4 mt-4 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setEditingSession(session);
                          setIsModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        onClick={() => handleCancelSession(session._id)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>

                      <button
                        onClick={() => handleCompleteSession(session._id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Schedule / Reschedule Modal */}
      <ScheduleSessionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSession(null);
        }}
        initialSession={editingSession}
        onSessionSaved={() => fetchSessions()}
      />
    </div>
  );
};

export default MySessions;
