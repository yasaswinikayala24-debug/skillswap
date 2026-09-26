import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import SkillBadge from '../components/SkillBadge';
import AddSkillModal from '../components/AddSkillModal';
import EditSkillModal from '../components/EditSkillModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import {
  GraduationCap,
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const MySkills = () => {
  const { token } = useAuth();

  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertMsg, setAlertMsg] = useState({ type: 'info', message: '' });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addType, setAddType] = useState('teach');

  const [editingItem, setEditingItem] = useState(null); // { item, type: 'teach' | 'learn' }
  const [deletingItem, setDeletingItem] = useState(null); // { item, type: 'teach' | 'learn' }
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUserSkills();
  }, []);

  const fetchUserSkills = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getMySkills(token);
      if (res.success && res.data) {
        setSkillsToTeach(res.data.skillsToTeach || []);
        setSkillsToLearn(res.data.skillsToLearn || []);
      }
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Failed to load your skills' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = (type) => {
    setAddType(type);
    setIsAddModalOpen(true);
  };

  const handleAddSkill = async (payload) => {
    if (payload.type === 'teach') {
      const res = await userAPI.addTeachingSkill(payload, token);
      if (res.success) {
        setSkillsToTeach(res.data);
        setAlertMsg({ type: 'success', message: res.message });
      }
    } else {
      const res = await userAPI.addLearningSkill(payload, token);
      if (res.success) {
        setSkillsToLearn(res.data);
        setAlertMsg({ type: 'success', message: res.message });
      }
    }
  };

  const handleSaveLevelUpdate = async (skillId, newLevel) => {
    if (editingItem.type === 'teach') {
      const res = await userAPI.updateTeachingSkill(skillId, newLevel, token);
      if (res.success) {
        setSkillsToTeach(res.data);
        setAlertMsg({ type: 'success', message: res.message });
      }
    } else {
      const res = await userAPI.updateLearningSkill(skillId, newLevel, token);
      if (res.success) {
        setSkillsToLearn(res.data);
        setAlertMsg({ type: 'success', message: res.message });
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      const skillId = deletingItem.item.skill._id;
      if (deletingItem.type === 'teach') {
        const res = await userAPI.deleteTeachingSkill(skillId, token);
        if (res.success) {
          setSkillsToTeach(res.data);
          setAlertMsg({ type: 'success', message: res.message });
        }
      } else {
        const res = await userAPI.deleteLearningSkill(skillId, token);
        if (res.success) {
          setSkillsToLearn(res.data);
          setAlertMsg({ type: 'success', message: res.message });
        }
      }
      setDeletingItem(null);
    } catch (err) {
      setAlertMsg({ type: 'error', message: err.message || 'Failed to remove skill' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading your skills..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skill Portfolio</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My SkillSwap Portfolio</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage skills you teach and skills you want to learn to help match with compatible swappers.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal('teach')}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      <Alert
        type={alertMsg.type}
        message={alertMsg.message}
        onClose={() => setAlertMsg({ type: 'info', message: '' })}
      />

      {/* Grid containing 2 sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Skills I Can Teach */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Skills I Can Teach</h2>
                <p className="text-xs text-slate-400">{skillsToTeach.length} active skills</p>
              </div>
            </div>

            <button
              onClick={() => handleOpenAddModal('teach')}
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>

          {skillsToTeach.length > 0 ? (
            <div className="space-y-3">
              {skillsToTeach.map((item, idx) => (
                <div
                  key={item.skill?._id || idx}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-white text-base">{item.skill?.name || 'Skill'}</h3>
                      <SkillBadge level={item.level} />
                    </div>
                    <p className="text-xs text-slate-400">Category: {item.skill?.category || 'General'}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setEditingItem({ item, type: 'teach' })}
                      className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                      title="Edit Skill Level"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem({ item, type: 'teach' })}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove Skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 space-y-3">
              <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">You haven't added any teaching skills yet.</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Share what you know to start connecting with eager learners.
              </p>
              <button
                onClick={() => handleOpenAddModal('teach')}
                className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add Teaching Skill</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Skills I Want to Learn */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Skills I Want To Learn</h2>
                <p className="text-xs text-slate-400">{skillsToLearn.length} target skills</p>
              </div>
            </div>

            <button
              onClick={() => handleOpenAddModal('learn')}
              className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-colors text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>

          {skillsToLearn.length > 0 ? (
            <div className="space-y-3">
              {skillsToLearn.map((item, idx) => (
                <div
                  key={item.skill?._id || idx}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-white text-base">{item.skill?.name || 'Skill'}</h3>
                      <SkillBadge level={item.level} />
                    </div>
                    <p className="text-xs text-slate-400">Category: {item.skill?.category || 'General'}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setEditingItem({ item, type: 'learn' })}
                      className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                      title="Edit Skill Level"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem({ item, type: 'learn' })}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove Skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">You haven't added any learning skills yet.</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Add the skills you are eager to master to get matched with skilled mentors.
              </p>
              <button
                onClick={() => handleOpenAddModal('learn')}
                className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add Learning Skill</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddSkillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialType={addType}
        onAddSuccess={handleAddSkill}
      />

      {editingItem && (
        <EditSkillModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          skillItem={editingItem.item}
          onSaveSuccess={handleSaveLevelUpdate}
        />
      )}

      {deletingItem && (
        <ConfirmDeleteModal
          isOpen={!!deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleConfirmDelete}
          skillName={deletingItem.item.skill?.name || 'Skill'}
          isSubmitting={isDeleting}
        />
      )}
    </div>
  );
};

export default MySkills;
