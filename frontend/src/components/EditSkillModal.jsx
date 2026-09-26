import React, { useState, useEffect } from 'react';
import { X, Edit3, Loader2 } from 'lucide-react';
import Alert from './Alert';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const EditSkillModal = ({ isOpen, onClose, skillItem, onSaveSuccess }) => {
  const [level, setLevel] = useState('Intermediate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (skillItem) {
      setLevel(skillItem.level || 'Intermediate');
    }
  }, [skillItem]);

  if (!isOpen || !skillItem) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await onSaveSuccess(skillItem.skill._id, level);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update skill level');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Edit Skill Level</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Skill Name</p>
            <p className="text-base font-bold text-white mt-0.5">{skillItem.skill?.name}</p>
            <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-semibold">
              Category: {skillItem.skill?.category || 'General'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Select New Proficiency Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
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

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSkillModal;
