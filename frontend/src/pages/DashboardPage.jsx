import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import MetricCard from '../components/MetricCard';
import {
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle2,
  UserCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Compass
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 1 Foundation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, {user?.name || 'Swapper'} 👋
            </h1>
            <p className="mt-2 text-slate-300 text-base max-w-xl">
              Your SkillSwap Dashboard is ready. Start by completing your user profile to get set up for skill matching in Phase 2.
            </p>
          </div>

          <Link
            to="/profile"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:shadow-indigo-500/40 shrink-0"
          >
            <UserCheck className="w-4 h-4" />
            <span>Complete Your Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Overview Title */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <span>Your SkillSwap Dashboard Overview</span>
        </h2>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Skills You Teach"
            value={0}
            icon={GraduationCap}
            badgeText="Phase 2"
            color="indigo"
          />
          <MetricCard
            title="Skills You Want to Learn"
            value={0}
            icon={BookOpen}
            badgeText="Phase 2"
            color="emerald"
          />
          <MetricCard
            title="Active Matches"
            value={0}
            icon={Users}
            badgeText="Phase 2"
            color="amber"
          />
          <MetricCard
            title="Completed Sessions"
            value={0}
            icon={CheckCircle2}
            badgeText="Phase 2"
            color="sky"
          />
        </div>
      </div>

      {/* Feature Preview & Empty State Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Complete Your Profile</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Add a custom bio and profile avatar URL to personalize your identity. A completed profile makes it easier for compatible skill partners to match with you.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <span className="text-xs text-slate-400">Account status: <strong className="text-emerald-400">Active</strong></span>
            <Link
              to="/profile"
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>Edit Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Phase 2 Coming Soon Card */}
        <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Skill Exchange Features Coming in Phase 2</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              In the upcoming phase, you will be able to list specific skills you want to teach or learn, browse available swappers in the directory, and schedule interactive learning sessions.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-1 text-slate-400">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Phase 1 Authentication & Profile fully functional</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
