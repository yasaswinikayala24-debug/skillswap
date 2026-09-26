import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { userAPI } from '../services/api';
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
  Sliders
} from 'lucide-react';

const DashboardPage = () => {
  const { user, token } = useAuth();

  const [teachCount, setTeachCount] = useState(0);
  const [learnCount, setLearnCount] = useState(0);

  useEffect(() => {
    fetchSkillCounts();
  }, [token]);

  const fetchSkillCounts = async () => {
    try {
      const res = await userAPI.getMySkills(token);
      if (res.success && res.data) {
        setTeachCount(res.data.skillsToTeach?.length || 0);
        setLearnCount(res.data.skillsToLearn?.length || 0);
      }
    } catch (err) {
      console.error('Error fetching dashboard skill counts:', err);
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
              <span>Phase 2 Skill Management</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, {user?.name || 'Swapper'} 👋
            </h1>
            <p className="mt-2 text-slate-300 text-base max-w-xl">
              Your SkillSwap Dashboard is live! Manage skills you can teach, discover skills to learn, and connect with swapper peers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/my-skills"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:shadow-indigo-500/40 shrink-0"
            >
              <Sliders className="w-4 h-4" />
              <span>Manage My Skills</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/my-skills"
          className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition-all flex items-center space-x-4 group"
        >
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm group-hover:text-indigo-300">My Skill Portfolio</h3>
            <p className="text-xs text-slate-400">Add or edit your skills</p>
          </div>
        </Link>

        <Link
          to="/skills"
          className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition-all flex items-center space-x-4 group"
        >
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm group-hover:text-purple-300">Explore Skills</h3>
            <p className="text-xs text-slate-400">Browse categories & topics</p>
          </div>
        </Link>

        <Link
          to="/find-people"
          className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/50 transition-all flex items-center space-x-4 group"
        >
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm group-hover:text-emerald-300">Find Swappers</h3>
            <p className="text-xs text-slate-400">Search peers by skill</p>
          </div>
        </Link>
      </div>

      {/* Dynamic Skill Statistics */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <span>Your SkillSwap Statistics</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Skills You Teach"
            value={teachCount}
            icon={GraduationCap}
            badgeText="Live"
            color="emerald"
          />
          <MetricCard
            title="Skills You Want to Learn"
            value={learnCount}
            icon={BookOpen}
            badgeText="Live"
            color="indigo"
          />
          <MetricCard
            title="Active Matches"
            value={0}
            icon={Users}
            badgeText="Phase 3"
            color="amber"
          />
          <MetricCard
            title="Completed Sessions"
            value={0}
            icon={CheckCircle2}
            badgeText="Phase 3"
            color="sky"
          />
        </div>
      </div>

      {/* Profile & Skill Setup Prompt Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Build Your Skill Portfolio</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Add skills you can teach and skills you are eager to learn. The more skills you list, the easier it is for compatible swappers to find you.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Listed: <strong className="text-emerald-400">{teachCount + learnCount} Skills</strong></span>
            <Link
              to="/my-skills"
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Manage Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">User Profile & Bio</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Personalize your public profile avatar and bio so peers learn more about your background and interests.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <span className="text-xs text-slate-400">Signed in as <strong className="text-white">{user?.name}</strong></span>
            <Link
              to="/profile"
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>Edit Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
