import React, { useState, useEffect } from 'react';
import { skillAPI } from '../services/api';
import Alert from './Alert';
import { X, PlusCircle, Search, Loader2 } from 'lucide-react';

const CATEGORIES = [
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

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const AddSkillModal = ({ isOpen, onClose, onAddSuccess, initialType = 'teach' }) => {
  const [availableSkills, setAvailableSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Intermediate');
  const [type, setType] = useState(initialType);
  const [isCustom, setIsCustom] = useState(false);
  
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      fetchSkills();
    }
  }, [isOpen, initialType]);

  const fetchSkills = async () => {
    setLoadingSkills(true);
    try {
      const res = await skillAPI.getAll();
      if (res.success && res.data) {
        setAvailableSkills(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch available skills:', err);
    } finally {
      setLoadingSkills(false);
    }
  };

  if (!isOpen) return null;

  const filteredSkills = availableSkills.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    let payload = {
      level,
      type
    };

    if (isCustom) {
      if (!customSkillName.trim()) {
        setErrorMsg('Please enter a custom skill name');
        return;
      }
      payload.skillName = customSkillName.trim();
      payload.category = category;
    } else {
      if (!selectedSkillId) {
        setErrorMsg('Please select a skill from the list');
        return;
      }
      payload.skillId = selectedSkillId;
    }

    setIsSubmitting(true);
    try {
      await onAddSuccess(payload);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Add Skill to Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Skill Type Radio (Teach vs Learn) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Skill Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('teach')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                  type === 'teach'
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-lg'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                🎓 I Can Teach
              </button>
              <button
                type="button"
                onClick={() => setType('learn')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                  type === 'learn'
                    ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-lg'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                📖 I Want to Learn
              </button>
            </div>
          </div>

          {/* Toggle between Select Existing Skill vs Custom Skill */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Select Skill
            </label>
            <button
              type="button"
              onClick={() => {
                setIsCustom(!isCustom);
                setErrorMsg('');
              }}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
            >
              {isCustom ? 'Select from list' : '+ Add new custom skill'}
            </button>
          </div>

          {!isCustom ? (
            <div>
              {/* Search input for available skills */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search existing skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Skill Dropdown / Select List */}
              <div className="max-h-48 overflow-y-auto rounded-xl bg-slate-950/90 border border-slate-800 divide-y divide-slate-800/60 p-1">
                {loadingSkills ? (
                  <div className="p-4 text-center text-xs text-slate-400">Loading available skills...</div>
                ) : filteredSkills.length > 0 ? (
                  filteredSkills.map((s) => (
                    <div
                      key={s._id}
                      onClick={() => setSelectedSkillId(s._id)}
                      className={`p-3 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-colors ${
                        selectedSkillId === s._id
                          ? 'bg-indigo-600/30 text-white font-bold border border-indigo-500/40'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="font-semibold">{s.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">{s.category}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No skills found matching "{searchTerm}".{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustom(true);
                        setCustomSkillName(searchTerm);
                      }}
                      className="text-indigo-400 font-semibold underline"
                    >
                      Create custom skill
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, TensorFlow, French"
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Skill Level Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Skill Proficiency Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    level === lvl
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <span>Add Skill</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;
