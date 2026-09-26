import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { exchangeAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import RequestStatusBadge from '../components/RequestStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import ScheduleSessionModal from '../components/ScheduleSessionModal';
import {
  Repeat,
  GraduationCap,
  BookOpen,
  User,
  ExternalLink,
  Sparkles,
  MessageSquare,
  Calendar,
  Clock
} from 'lucide-react';

const ActiveExchanges = () => {
  const { token, user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExchangeForModal, setSelectedExchangeForModal] = useState(null);

  useEffect(() => {
    fetchActiveExchanges();
  }, [token]);

  const fetchActiveExchanges = async () => {
    setLoading(true);
    try {
      const res = await exchangeAPI.getActiveExchanges(token);
      if (res.success && res.data) {
        setExchanges(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load active exchanges');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading active skill exchanges..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Repeat className="w-3.5 h-3.5" />
            <span>Active Skill Exchanges</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Active Skill Exchanges
          </h1>
          <p className="mt-2 text-slate-300 text-base">
            Your accepted peer-to-peer exchange partnerships. Start real-time chat, schedule sessions, and track learning!
          </p>
        </div>
      </div>

      <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />

      {/* Grid of Active Exchanges */}
      {exchanges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exchanges.map((ex) => {
            const isSender = ex.sender?._id === currentUser?._id;
            const partner = isSender ? ex.receiver : ex.sender;
            const youTeach = isSender ? ex.offeredSkill : ex.requestedSkill;
            const youLearn = isSender ? ex.requestedSkill : ex.offeredSkill;

            return (
              <div
                key={ex._id}
                className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6 hover:border-emerald-500/40 transition-all shadow-xl"
              >
                <div className="space-y-4">
                  {/* Swapper Info */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-emerald-500/40 shrink-0 flex items-center justify-center font-bold text-white">
                        {partner?.profileImage ? (
                          <img src={partner.profileImage} alt={partner.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{partner?.name || 'Swapper'}</h3>
                        <p className="text-xs text-purple-400">{partner?.role || 'Student'}</p>
                      </div>
                    </div>
                    <RequestStatusBadge status="accepted" />
                  </div>

                  {/* Active Exchange Details */}
                  <div className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs">
                    <div className="flex items-start space-x-2">
                      <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                          You Teach:
                        </span>
                        <p className="font-bold text-white text-sm">{youTeach?.name || 'Skill'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 pt-2 border-t border-slate-800/60">
                      <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                          You Learn:
                        </span>
                        <p className="font-bold text-white text-sm">{youLearn?.name || 'Skill'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons: Chat, Schedule Session, View Sessions */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate('/chat')}
                      className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedExchangeForModal({
                          _id: ex._id,
                          partnerName: partner?.name
                        });
                        setIsModalOpen(true);
                      }}
                      className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold text-xs transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      to="/my-sessions"
                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                    >
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>View Sessions</span>
                    </Link>

                    <Link
                      to={`/user/${partner?._id}`}
                      className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center glass-panel rounded-3xl border border-slate-800 max-w-md mx-auto space-y-4">
          <Repeat className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No active skill exchanges yet</h3>
          <p className="text-slate-400 text-xs">
            Send skill exchange requests to matched swappers in Matches or respond to incoming requests!
          </p>
          <Link
            to="/matches"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find Matches</span>
          </Link>
        </div>
      )}

      {/* Schedule Session Modal */}
      <ScheduleSessionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExchangeForModal(null);
        }}
        exchangeRequest={selectedExchangeForModal}
      />
    </div>
  );
};

export default ActiveExchanges;
