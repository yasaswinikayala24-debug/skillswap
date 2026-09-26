import React, { useState, useEffect } from 'react';
import { userAPI, exchangeAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import Alert from './Alert';
import { Send, X, Loader2, Sparkles } from 'lucide-react';

const ExchangeRequestModal = ({ isOpen, onClose, targetUser, onRequestSuccess }) => {
  const { token } = useAuth();

  const [myTeachSkills, setMyTeachSkills] = useState([]);
  const [offeredSkillId, setOfferedSkillId] = useState('');
  const [requestedSkillId, setRequestedSkillId] = useState('');
  const [message, setMessage] = useState('');

  const [loadingUserSkills, setLoadingUserSkills] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen && token) {
      fetchMySkills();
    }
  }, [isOpen, token]);

  useEffect(() => {
    // Auto-select initial skills if available
    if (myTeachSkills.length > 0) {
      setOfferedSkillId(myTeachSkills[0].skill?._id || '');
    }
    if (targetUser?.skillsToTeach?.length > 0) {
      setRequestedSkillId(targetUser.skillsToTeach[0].skill?._id || '');
    }
  }, [myTeachSkills, targetUser]);

  const fetchMySkills = async () => {
    setLoadingUserSkills(true);
    try {
      const res = await userAPI.getMySkills(token);
      if (res.success && res.data) {
        setMyTeachSkills(res.data.skillsToTeach || []);
      }
    } catch (err) {
      console.error('Failed to load my teaching skills:', err);
    } finally {
      setLoadingUserSkills(false);
    }
  };

  if (!isOpen || !targetUser) return null;

  const targetTeachSkills = targetUser.skillsToTeach || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!offeredSkillId) {
      setErrorMsg('Please select a skill you can offer to teach');
      return;
    }
    if (!requestedSkillId) {
      setErrorMsg('Please select a skill you want to learn from this swapper');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await exchangeAPI.sendRequest(
        {
          receiverId: targetUser._id,
          offeredSkillId,
          requestedSkillId,
          message: message.trim()
        },
        token
      );

      if (res.success) {
        if (onRequestSuccess) onRequestSuccess(res.message || 'Exchange request sent!');
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send exchange request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Send Skill Exchange Request</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />

        {/* Target User Card */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-indigo-500/40 shrink-0 flex items-center justify-center font-bold text-white text-lg">
            {targetUser.name ? targetUser.name.charAt(0) : 'U'}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Requesting Exchange With</p>
            <h4 className="text-base font-bold text-white">{targetUser.name}</h4>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* I Can Teach Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
              🎓 Skill You Offer to Teach
            </label>
            {loadingUserSkills ? (
              <p className="text-xs text-slate-400">Loading your teaching skills...</p>
            ) : myTeachSkills.length > 0 ? (
              <select
                value={offeredSkillId}
                onChange={(e) => setOfferedSkillId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {myTeachSkills.map((item) => (
                  <option key={item.skill?._id} value={item.skill?._id}>
                    {item.skill?.name} ({item.level})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                You haven't listed any teaching skills yet. Please add a skill to your profile first.
              </div>
            )}
          </div>

          {/* I Want to Learn Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
              📖 Skill You Request to Learn from {targetUser.name}
            </label>
            {targetTeachSkills.length > 0 ? (
              <select
                value={requestedSkillId}
                onChange={(e) => setRequestedSkillId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {targetTeachSkills.map((item) => (
                  <option key={item.skill?._id} value={item.skill?._id}>
                    {item.skill?.name} ({item.level})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                This user has not listed any teaching skills.
              </div>
            )}
          </div>

          {/* Personal Message */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Personal Message <span className="text-slate-500 font-normal lowercase">(optional)</span>
              </label>
              <span className="text-[10px] text-slate-500">{message.length}/500</span>
            </div>
            <textarea
              rows="3"
              maxLength="500"
              placeholder={`Hi ${targetUser.name}, I would love to exchange skills with you! I can teach Python if you can teach me React...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || myTeachSkills.length === 0 || targetTeachSkills.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExchangeRequestModal;
