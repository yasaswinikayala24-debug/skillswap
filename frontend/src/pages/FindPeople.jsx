import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { userAPI } from '../services/api';
import UserSkillCard from '../components/UserSkillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { Users, Search, Sparkles } from 'lucide-react';

const FindPeople = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('skill') || '';

  const [query, setQuery] = useState(initialQuery);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchUsers(query);
  }, [query]);

  const fetchUsers = async (searchQuery) => {
    setLoading(true);
    try {
      const res = await userAPI.searchUsers(searchQuery);
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to search users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(query ? { skill: query } : {});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Peer Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Find Skill Partners</h1>
          <p className="mt-2 text-slate-300 text-base">
            Search for community members who teach the skills you want to learn, or connect with peers eager to learn what you know.
          </p>
        </div>
      </div>

      <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />

      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search by skill name (e.g. Python, React.js), user name, or bio..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
        >
          Search
        </button>
      </form>

      {/* Users Result Grid */}
      {loading ? (
        <LoadingSpinner label="Searching swappers..." />
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <UserSkillCard key={u._id} user={u} />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 text-center glass-panel rounded-3xl border border-slate-800 max-w-lg mx-auto space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No users found for this skill</h3>
          <p className="text-slate-400 text-xs">
            Try searching for another skill like "Python", "React.js", or "UI/UX Design".
          </p>
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSearchParams({});
              }}
              className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
            >
              Show All Swappers
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FindPeople;
