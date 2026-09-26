import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { sessionAPI, exchangeAPI } from '../services/api';

const ScheduleSessionModal = ({ isOpen, onClose, exchangeRequest, initialSession, onSessionSaved }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState(60);
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchangeId, setSelectedExchangeId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(null);

      if (initialSession) {
        // Reschedule mode
        setTitle(initialSession.title || '');
        setDescription(initialSession.description || '');
        setDuration(initialSession.duration || 60);
        setSelectedExchangeId(initialSession.exchangeRequest?._id || initialSession.exchangeRequest || '');
        
        if (initialSession.scheduledAt) {
          const dateObj = new Date(initialSession.scheduledAt);
          // Format for datetime-local input YYYY-MM-DDTHH:mm
          const formatted = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
          setScheduledAt(formatted);
        }
      } else {
        // Create mode
        setTitle('');
        setDescription('');
        setDuration(60);
        // Default tomorrow at 18:00
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(18, 0, 0, 0);
        const formatted = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setScheduledAt(formatted);

        if (exchangeRequest) {
          setSelectedExchangeId(exchangeRequest._id);
          const partnerName = exchangeRequest.partnerName || 'Partner';
          setTitle(`Session with ${partnerName}`);
        } else {
          // Fetch active exchanges to choose from
          const fetchExchanges = async () => {
            try {
              const res = await exchangeAPI.getActiveExchanges();
              if (res.success && res.data) {
                setExchanges(res.data);
                if (res.data.length > 0) {
                  setSelectedExchangeId(res.data[0]._id);
                }
              }
            } catch (err) {
              setError('Failed to load active exchanges');
            }
          };
          fetchExchanges();
        }
      }
    }
  }, [isOpen, exchangeRequest, initialSession]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError('Please provide a session title');
      return;
    }

    if (!scheduledAt) {
      setError('Please select date and time for the session');
      return;
    }

    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate < new Date()) {
      setError('Session date cannot be scheduled in the past');
      return;
    }

    const exchangeId = exchangeRequest?._id || selectedExchangeId;
    if (!exchangeId && !initialSession) {
      setError('Please select an active skill exchange');
      return;
    }

    setLoading(true);

    try {
      let res;
      if (initialSession) {
        // Update / Reschedule
        res = await sessionAPI.updateSession(initialSession._id, {
          title: title.trim(),
          description: description.trim(),
          scheduledAt,
          duration: Number(duration)
        });
      } else {
        // Create
        res = await sessionAPI.createSession({
          exchangeRequestId: exchangeId,
          title: title.trim(),
          description: description.trim(),
          scheduledAt,
          duration: Number(duration)
        });
      }

      if (res.success) {
        setSuccess(initialSession ? 'Session rescheduled successfully!' : 'Session scheduled successfully!');
        if (onSessionSaved) onSessionSaved(res.data);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Failed to save session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {initialSession ? 'Reschedule Session' : 'Schedule Skill Exchange Session'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Select Exchange if not provided */}
          {!exchangeRequest && !initialSession && exchanges.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Select Active Exchange Partner
              </label>
              <select
                value={selectedExchangeId}
                onChange={(e) => setSelectedExchangeId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm"
              >
                {exchanges.map((ex) => (
                  <option key={ex._id} value={ex._id}>
                    {ex.offeredSkill?.name} ↔ {ex.requestedSkill?.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Session Title *
            </label>
            <input
              type="text"
              required
              maxLength={150}
              placeholder="e.g. React Hooks & State Management Basics"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Description / Agenda (Optional)
            </label>
            <textarea
              rows={3}
              maxLength={500}
              placeholder="Outline what you will cover in this session..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm resize-none"
            />
          </div>

          {/* Date Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Duration *
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-sm"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes (1 hour)</option>
                <option value={90}>90 minutes (1.5 hours)</option>
                <option value={120}>120 minutes (2 hours)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-purple-600/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : initialSession ? 'Update Session' : 'Schedule Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleSessionModal;
