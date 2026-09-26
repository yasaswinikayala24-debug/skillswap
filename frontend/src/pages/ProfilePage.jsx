import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import Alert from '../components/Alert';
import { User, Mail, FileText, Image as ImageIcon, Save, Loader2, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profileImage: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
    if (successMsg) setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Full Name cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setSuccessMsg('Profile updated successfully and saved to database!');
      }
    } catch (error) {
      setErrorMsg(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 border-b border-slate-800 pb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-800 border-2 border-indigo-500/40 flex items-center justify-center text-slate-400 shadow-xl">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                  }}
                />
              ) : (
                <User className="w-12 h-12" />
              )}
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{user?.name}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Role: {user?.role || 'Student'}
            </span>
          </div>
        </div>

        <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
        <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-800/60 pb-3">
            Edit Profile Information
          </h2>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-5 h-5" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Email (Read Only) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Email Address <span className="text-slate-500 font-normal lowercase">(read-only)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                disabled
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800/50 text-slate-400 text-sm cursor-not-allowed select-none"
              />
            </div>
          </div>

          {/* Profile Image URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Profile Image URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <ImageIcon className="w-5 h-5" />
              </div>
              <input
                id="profileImage"
                name="profileImage"
                type="url"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">Provide an image URL to update your avatar.</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Bio
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-3.5 flex items-start pointer-events-none text-slate-500">
                <FileText className="w-5 h-5" />
              </div>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell the SkillSwap community about yourself, your background, and what you love learning or teaching..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              ></textarea>
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
