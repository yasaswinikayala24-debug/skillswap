import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { userAPI, matchAPI, exchangeAPI } from '../services/api';
import MetricCard from '../components/MetricCard';
import {
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle2,
  UserCheck,
  Sparkles,
  ArrowRight,
  Compass,
  Sliders,
  Inbox,
  Repeat
} from 'lucide-react';

const DashboardPage = () => {
  const { user, token } = useAuth();

  const [teachCount, setTeachCount] = useState(0);
  const [learnCount, setLearnCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeExchangeCount, setActiveExchangeCount] = useState(0);

  useEffect(() => {
    if (token) {
      fetchDashboardStats();
    }
  }, [token]);

  const fetchDashboardStats = async () => {
    try {
      const [skillsRes, matchRes, pendingRes, activeRes] = await Promise.all([
        userAPI.getMySkills(token),
        matchAPI.getMatches({}, token),
        exchangeAPI.getPendingCount(token),
        exchangeAPI.getActiveExchanges(token)
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
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 3 Skill Matching & Exchanges</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, {user?.name || 'Swapper'} 👋
            </h1>
            <p className="mt-2 text-slate-300 text-base max-w-xl">
              Discover smart skill matches, manage your exchange requests, and collaborate with your learning partners.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/matches"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:shadow-indigo-500/40 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find Matches</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/matches"
          className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition-all flex items-center space-x-3 group"
        >
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs group-hover:text-indigo-300">Find Matches</h3>
            <p className="text-[11px] text-slate-400">{matchCount} available</p>
          </div>
        </Link>

        <Link
          to="/exchange-requests"
          className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition-all flex items-center space-x-3 group relative"
        >
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs group-hover:text-purple-300">Requests</h3>
            <p className="text-[11px] text-slate-400">{pendingCount} pending</p>
          </div>
        </Link>

        <Link
          to="/my-exchanges"
          className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition-all flex items-center space-x-3 group"
        >
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs group-hover:text-emerald-300">My Exchanges</h3>
            <p className="text-[11px] text-slate-400">{activeExchangeCount} active</p>
          </div>
        </Link>

        <Link
          to="/my-skills"
          className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition-all flex items-center space-x-3 group"
        >
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs group-hover:text-amber-300">My Portfolio</h3>
            <p className="text-[11px] text-slate-400">{teachCount + learnCount} skills</p>
          </div>
        </Link>
      </div>

      {/* Dynamic Statistics */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <span>SkillSwap Real-Time Analytics</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Skills You Teach"
            value={teachCount}
            icon={GraduationCap}
            badgeText="Portfolio"
            color="emerald"
          />
          <MetricCard
            title="Skills You Learn"
            value={learnCount}
            icon={BookOpen}
            badgeText="Portfolio"
            color="indigo"
          />
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
            color="amber"
          />
          <MetricCard
            title="Active Exchanges"
            value={activeExchangeCount}
            icon={Repeat}
            badgeText="Accepted"
            color="sky"
          />
        </div>
      </div>

      {/* Action Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Skill Matching</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our matching system analyzes your skills to teach and skills to learn against other community swappers to compute deterministic match percentages.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <span className="text-xs text-slate-400">Available: <strong className="text-indigo-400">{matchCount} Matches</strong></span>
            <Link
              to="/matches"
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>Explore Matches</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Repeat className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Exchange Requests & Partnerships</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Send requests to your top skill matches, accept incoming proposals, and track active skill exchange partnerships.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <span className="text-xs text-slate-400">Active Partnerships: <strong className="text-emerald-400">{activeExchangeCount}</strong></span>
            <Link
              to="/exchange-requests"
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>View Requests</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
