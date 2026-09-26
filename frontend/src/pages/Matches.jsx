import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import MatchCard from '../components/MatchCard';
import ExchangeRequestModal from '../components/ExchangeRequestModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { Sparkles, Search, Filter, SlidersHorizontal, Sliders } from 'lucide-react';

const MATCH_TYPES = ['All', 'Strong Match', 'Good Match', 'Possible Match'];

const Matches = () => {
  const { token } = useAuth();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [minMatch, setMinMatch] = useState('');
  const [matchType, setMatchType] = useState('All');
  const [sortBy, setSortBy] = useState('highest');

  // Modal State
  const [selectedTargetUser, setSelectedTargetUser] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, [minMatch, matchType, sortBy]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await matchAPI.getMatches(
        {
          minMatch,
          matchType,
          skill: search.trim(),
          sortBy
        },
        token
      );
      if (res.success && res.data) {
        setMatches(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load recommended matches');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMatches();
  };

  const filteredMatches = matches.filter((m) => {
    if (!search.trim()) return true;
    const term = search.trim().toLowerCase();
    const nameMatch = m.user.name.toLowerCase().includes(term);
    const skillMatch = m.matchedSkills.some((s) =>
      typeof s === 'string' && s.toLowerCase().includes(term)
    );
    return nameMatch || skillMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Skill Matching Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Find Your SkillSwap Partners
          </h1>
          <p className="mt-2 text-slate-300 text-base">
            Discover people who can teach what you want to learn and learn what you can teach.
          </p>
        </div>
      </div>

      <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
      <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />

      {/* Filter and Search Controls */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search matches by skill or user name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </form>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <label className="text-xs text-slate-400 font-semibold">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="highest">Highest Match Percentage</option>
              <option value="recent">Recently Joined</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-2">
          <Filter className="w-4 h-4 text-indigo-400 shrink-0 mr-1" />
          {MATCH_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setMatchType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                matchType === type
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Match Cards Grid */}
      {loading ? (
        <LoadingSpinner label="Finding your skill matches..." />
      ) : filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((m) => (
            <MatchCard
              key={m.user._id}
              match={m}
              onOpenRequestModal={(targetUser) => setSelectedTargetUser(targetUser)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 text-center glass-panel rounded-3xl border border-slate-800 max-w-md mx-auto space-y-4">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No skill matches found yet</h3>
          <p className="text-slate-400 text-xs">
            Try adding more skills to your teaching or learning list to increase your match percentage.
          </p>
          <Link
            to="/my-skills"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
          >
            <Sliders className="w-4 h-4" />
            <span>Manage My Skills</span>
          </Link>
        </div>
      )}

      {/* Exchange Request Modal */}
      {selectedTargetUser && (
        <ExchangeRequestModal
          isOpen={!!selectedTargetUser}
          onClose={() => setSelectedTargetUser(null)}
          targetUser={selectedTargetUser}
          onRequestSuccess={(msg) => setSuccessMsg(msg)}
        />
      )}
    </div>
  );
};

export default Matches;
