import React, { useState, useEffect } from 'react';
import { skillAPI } from '../services/api';
import SkillCard from '../components/SkillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { Search, Compass, Filter, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Programming',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Database',
  'Cloud Computing',
  'Cyber Security',
  'UI/UX Design',
  'Digital Marketing',
  'Communication',
  'Languages',
  'Business',
  'Photography',
  'Video Editing',
  'Other'
];

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchSkills();
  }, [search, selectedCategory]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await skillAPI.getAll({
        search: search.trim(),
        category: selectedCategory === 'All' ? '' : selectedCategory
      });
      if (res.success && res.data) {
        setSkills(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to load skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Skill Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Explore Skills</h1>
          <p className="mt-2 text-slate-300 text-base">
            Discover popular skills being taught and learned across the SkillSwap community. Find your next learning goal!
          </p>
        </div>
      </div>

      <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />

      {/* Search Bar & Filters */}
      <div className="space-y-4">
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search skills by name, technology, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-indigo-400 shrink-0 mr-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80 border border-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <LoadingSpinner label="Loading skills..." />
      ) : skills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <SkillCard key={skill._id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 text-center glass-panel rounded-3xl border border-slate-800 max-w-lg mx-auto space-y-3">
          <Compass className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No skills found</h3>
          <p className="text-slate-400 text-xs">
            We couldn't find any skills matching "{search}". Try searching for a different term or category.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
            }}
            className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Skills;
