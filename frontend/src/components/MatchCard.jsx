import React from 'react';
import { Link } from 'react-router-dom';
import { User, Sparkles, ArrowRight, Send, CheckCircle2, GraduationCap, BookOpen } from 'lucide-react';

const MatchCard = ({ match, onOpenRequestModal }) => {
  if (!match || !match.user) return null;

  const targetUser = match.user;
  const matchPercentage = match.matchPercentage || 0;
  const matchType = match.matchType || 'Match';

  const badgeColor =
    matchPercentage >= 80
      ? 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40'
      : matchPercentage >= 60
      ? 'from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/40'
      : 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40';

  return (
    <div className="rounded-3xl bg-slate-800/40 border border-slate-700/60 p-6 backdrop-blur-md flex flex-col justify-between space-y-6 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div>
        {/* Match Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${badgeColor} border text-xs font-extrabold flex items-center space-x-1.5 shadow-md`}>
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{matchPercentage}% Match</span>
            <span className="text-[10px] font-normal opacity-80">• {matchType}</span>
          </div>

          {match.isTwoWay && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
              Two-Way Exchange
            </span>
          )}
        </div>

        {/* User Details */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 border-2 border-indigo-500/40 shrink-0 flex items-center justify-center text-slate-300 shadow-md">
            {targetUser.profileImage ? (
              <img
                src={targetUser.profileImage}
                alt={targetUser.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <User className="w-7 h-7" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{targetUser.name}</h3>
            <p className="text-xs text-indigo-400 font-medium">{targetUser.role || 'Swapper'}</p>
            {targetUser.bio && (
              <p className="text-xs text-slate-400 line-clamp-2 mt-1 italic">"{targetUser.bio}"</p>
            )}
          </div>
        </div>

        {/* Match breakdown preview */}
        <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
          <div>
            <span className="font-semibold text-indigo-300 flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>You can learn:</span>
            </span>
            <p className="text-slate-300 mt-0.5 font-medium">
              {match.skillsYouCanLearn?.length > 0
                ? match.skillsYouCanLearn.map((item) => item.skill?.name || item.skill).join(', ')
                : 'Explore mutual topics'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/60">
            <span className="font-semibold text-emerald-300 flex items-center space-x-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>You can teach:</span>
            </span>
            <p className="text-slate-300 mt-0.5 font-medium">
              {match.skillsYouCanTeach?.length > 0
                ? match.skillsYouCanTeach.map((item) => item.skill?.name || item.skill).join(', ')
                : 'Explore mutual topics'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between gap-3">
        <Link
          to={`/matches/${targetUser._id}`}
          className="text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <span>View Match</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={() => onOpenRequestModal(targetUser)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Request</span>
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
