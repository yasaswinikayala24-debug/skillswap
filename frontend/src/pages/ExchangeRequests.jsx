import React, { useState, useEffect } from 'react';
import { exchangeAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import RequestStatusBadge from '../components/RequestStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import {
  Inbox,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MessageSquare,
  Sparkles
} from 'lucide-react';

const ExchangeRequests = () => {
  const { token } = useAuth();

  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);

  const [alertMsg, setAlertMsg] = useState({ type: 'info', message: '' });
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchAllRequests();
  }, [token]);

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const [recRes, sentRes] = await Promise.all([
        exchangeAPI.getReceivedRequests(token),
        exchangeAPI.getSentRequests(token)
      ]);

      if (recRes.success) setReceivedRequests(recRes.data || []);
      if (sentRes.success) setSentRequests(sentRes.data || []);
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Failed to load requests' });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    setProcessingId(id);
    try {
      const res = await exchangeAPI.acceptRequest(id, token);
      if (res.success) {
        setAlertMsg({ type: 'success', message: 'Request accepted successfully!' });
        fetchAllRequests();
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Failed to accept request' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      const res = await exchangeAPI.rejectRequest(id, token);
      if (res.success) {
        setAlertMsg({ type: 'success', message: 'Request rejected.' });
        fetchAllRequests();
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Failed to reject request' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (id) => {
    setProcessingId(id);
    try {
      const res = await exchangeAPI.cancelRequest(id, token);
      if (res.success) {
        setAlertMsg({ type: 'success', message: 'Request cancelled.' });
        fetchAllRequests();
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Failed to cancel request' });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading exchange requests..." />;
  }

  const pendingReceived = receivedRequests.filter((r) => r.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Inbox className="w-3.5 h-3.5" />
            <span>Exchange Requests</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skill Exchange Requests
          </h1>
          <p className="mt-2 text-slate-300 text-base">
            Review incoming requests from swapper peers or monitor requests you have sent out.
          </p>
        </div>
      </div>

      <Alert
        type={alertMsg.type}
        message={alertMsg.message}
        onClose={() => setAlertMsg({ type: 'info', message: '' })}
      />

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'received'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/50'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Received Requests ({receivedRequests.length})</span>
          {pendingReceived.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold animate-pulse">
              {pendingReceived.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'sent'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/50'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Requests ({sentRequests.length})</span>
        </button>
      </div>

      {/* Tab 1: Received Requests */}
      {activeTab === 'received' && (
        <div className="space-y-6">
          {receivedRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {receivedRequests.map((req) => (
                <div
                  key={req._id}
                  className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-5 hover:border-indigo-500/40 transition-all shadow-xl"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-indigo-500/40 shrink-0 flex items-center justify-center text-slate-300 font-bold">
                          {req.sender?.profileImage ? (
                            <img src={req.sender.profileImage} alt={req.sender.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base">{req.sender?.name || 'Swapper'}</h3>
                          <p className="text-xs text-indigo-400">{req.sender?.role || 'Student'}</p>
                        </div>
                      </div>
                      <RequestStatusBadge status={req.status} />
                    </div>

                    {/* Trade Details */}
                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                          Offers to Teach You:
                        </span>
                        <p className="font-bold text-white text-sm">{req.offeredSkill?.name || 'Skill'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                          Wants to Learn from You:
                        </span>
                        <p className="font-bold text-white text-sm">{req.requestedSkill?.name || 'Skill'}</p>
                      </div>
                    </div>

                    {/* Message */}
                    {req.message && (
                      <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-start space-x-2 italic">
                        <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>"{req.message}"</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {req.status === 'pending' ? (
                    <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                      <button
                        onClick={() => handleReject(req._id)}
                        disabled={processingId === req._id}
                        className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 font-bold text-xs transition-all flex items-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleAccept(req._id)}
                        disabled={processingId === req._id}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept Request</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-800 text-xs text-slate-500 text-right italic">
                      Request status is {req.status}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center glass-panel rounded-3xl border border-slate-800 max-w-md mx-auto space-y-3">
              <Inbox className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No received requests</h3>
              <p className="text-slate-400 text-xs">
                You haven't received any skill exchange requests yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Sent Requests */}
      {activeTab === 'sent' && (
        <div className="space-y-6">
          {sentRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sentRequests.map((req) => (
                <div
                  key={req._id}
                  className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-5 hover:border-indigo-500/40 transition-all shadow-xl"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-indigo-500/40 shrink-0 flex items-center justify-center text-slate-300 font-bold">
                          {req.receiver?.profileImage ? (
                            <img src={req.receiver.profileImage} alt={req.receiver.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Sent To:</p>
                          <h3 className="font-bold text-white text-base">{req.receiver?.name || 'Swapper'}</h3>
                        </div>
                      </div>
                      <RequestStatusBadge status={req.status} />
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                          You Offer to Teach:
                        </span>
                        <p className="font-bold text-white text-sm">{req.offeredSkill?.name || 'Skill'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                          You Requested to Learn:
                        </span>
                        <p className="font-bold text-white text-sm">{req.requestedSkill?.name || 'Skill'}</p>
                      </div>
                    </div>

                    {req.message && (
                      <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 italic">
                        "{req.message}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {req.status === 'pending' ? (
                    <div className="pt-3 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => handleCancel(req._id)}
                        disabled={processingId === req._id}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all flex items-center space-x-1"
                      >
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span>Cancel Request</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-800 text-xs text-slate-500 text-right italic">
                      Request status is {req.status}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center glass-panel rounded-3xl border border-slate-800 max-w-md mx-auto space-y-3">
              <Send className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No sent requests</h3>
              <p className="text-slate-400 text-xs">
                You haven't sent any skill exchange requests yet. Discover swappers in Matches or Find People!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExchangeRequests;
