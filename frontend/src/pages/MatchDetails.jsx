import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { matchAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import SkillBadge from '../components/SkillBadge';
import ExchangeRequestModal from '../components/ExchangeRequestModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import {
  Sparkles,
  ArrowLeft,
  Send,
  User,
  GraduationCap,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

const MatchDetails = () => {
  const { userId } = useParams();
  const { token, user: currentUser } = useAuth();

  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (userId && token) {
      fetchMatchDetails();
    }
  }, [userId, token]);

  const fetchMatchDetails = async () => {
    setLoading(true);
    try {
      const res = await matchAPI.getMatchDetails(userId, token);
      if (res.success && res.data) {
        setMatchData(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Calculating skill match details..." />;
  }

  if (errorMsg || !matchData || !matchData.user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Alert type="error" message={errorMsg || 'Match details not found.'} />
        <Link
          to="/matches"
          className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matches</span>
        </Link>
      </div>
    );
  }

  const targetUser = matchData.user;
  const matchPercentage = matchData.matchPercentage || 0;
  const matchType = matchData.matchType || 'Match';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation Back Link */}
      <div>
        <Link
          to="/matches"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matches</span>
        </Link>
      </div>

      <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
      <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />

      {/* Hero Match Summary Card */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-800 border-2 border-indigo-500/40 shrink-0 flex items-center justify-center text-slate-300 shadow-xl">
              {targetUser.profileImage ? (
                <img
                  src={targetUser.profileImage}
                  alt={targetUser.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            <div>
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">SkillSwap Match</span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{targetUser.name}</h1>
              <p className="text-xs text-slate-400">{targetUser.role || 'Swapper'}</p>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="text-center md:text-right shrink-0">
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 font-black text-2xl shadow-xl">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <span>{matchPercentage}%</span>
            </div>
            <p className="text-xs font-bold text-slate-300 mt-2 uppercase tracking-wider">{matchType}</p>
          </div>
        </div>

        {/* Exchange Opportunities Section */}
        <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            <span>Exchange Opportunities</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                📖 You Can Learn
              </span>
              <p className="font-semibold text-white">
                {matchData.skillsYouCanLearn?.length > 0
                  ? matchData.skillsYouCanLearn.map((item) => item.skill?.name || item.skill).join(', ')
                  : 'No direct learning overlap'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                🎓 You Can Teach
              </span>
              <p className="font-semibold text-white">
                {matchData.skillsYouCanTeach?.length > 0
                  ? matchData.skillsYouCanTeach.map((item) => item.skill?.name || item.skill).join(', ')
                  : 'No direct teaching overlap'}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown: Your Skills vs Their Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Skills */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <span>Your Skills</span>
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-emerald-400 uppercase mb-2">Skills You Can Teach</p>
                {currentUser?.skillsToTeach?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentUser.skillsToTeach.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
                        <span className="font-semibold text-white">{item.skill?.name || 'Skill'}</span>
                        <SkillBadge level={item.level} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">None listed.</p>
                )}
              </div>

              <div className="pt-2">
                <p className="text-xs font-semibold text-indigo-400 uppercase mb-2">Skills You Want to Learn</p>
                {currentUser?.skillsToLearn?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentUser.skillsToLearn.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
                        <span className="font-semibold text-white">{item.skill?.name || 'Skill'}</span>
                        <SkillBadge level={item.level} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">None listed.</p>
                )}
              </div>
            </div>
          </div>

          {/* Their Skills */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
              <span>{targetUser.name}'s Skills</span>
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-emerald-400 uppercase mb-2">Skills They Can Teach</p>
                {targetUser.skillsToTeach?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {targetUser.skillsToTeach.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
                        <span className="font-semibold text-white">{item.skill?.name || 'Skill'}</span>
                        <SkillBadge level={item.level} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">None listed.</p>
                )}
              </div>

              <div className="pt-2">
                <p className="text-xs font-semibold text-indigo-400 uppercase mb-2">Skills They Want to Learn</p>
                {targetUser.skillsToLearn?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {targetUser.skillsToLearn.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
                        <span className="font-semibold text-white">{item.skill?.name || 'Skill'}</span>
                        <SkillBadge level={item.level} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">None listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Send Exchange Request</span>
          </button>
        </div>
      </div>

      {/* Exchange Request Modal */}
      {isModalOpen && (
        <ExchangeRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          targetUser={targetUser}
          onRequestSuccess={(msg) => setSuccessMsg(msg)}
        />
      )}
    </div>
  );
};

export default MatchDetails;
