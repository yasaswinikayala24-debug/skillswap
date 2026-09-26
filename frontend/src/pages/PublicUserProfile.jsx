import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { User, GraduationCap, BookOpen, ArrowLeft, Calendar } from 'lucide-react';

const PublicUserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getPublicProfile(id);
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'User profile not found.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading swapper profile..." />;
  }

  if (errorMsg || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Alert type="error" message={errorMsg || 'User not found.'} />
        <Link
          to="/find-people"
          className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Find People</span>
        </Link>
      </div>
    );
  }

  const teachSkills = profile.skillsToTeach || [];
  const learnSkills = profile.skillsToLearn || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation Back Link */}
      <div>
        <Link
          to="/find-people"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Find People</span>
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 border-b border-slate-800 pb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-800 border-2 border-indigo-500/40 flex items-center justify-center text-slate-300 shadow-xl shrink-0">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <User className="w-12 h-12" />
            )}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{profile.name}</h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Role: {profile.role || 'Student'}
              </span>
              {profile.createdAt && (
                <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                </span>
              )}
            </div>

            {profile.bio ? (
              <p className="text-slate-300 text-sm pt-3 leading-relaxed max-w-xl">
                "{profile.bio}"
              </p>
            ) : (
              <p className="text-slate-500 text-xs italic pt-2">No bio provided yet.</p>
            )}
          </div>
        </div>

        {/* Skills I Can Teach Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span>Skills {profile.name} Can Teach ({teachSkills.length})</span>
          </h2>

          {teachSkills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teachSkills.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-white text-sm">{item.skill?.name || 'Skill'}</h3>
                    <p className="text-[11px] text-slate-400">Category: {item.skill?.category || 'General'}</p>
                  </div>
                  <SkillBadge level={item.level} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-4 rounded-xl bg-slate-950/40 border border-slate-800">
              No teaching skills listed yet.
            </p>
          )}
        </div>

        {/* Skills I Want to Learn Section */}
        <div className="space-y-4 pt-4 border-t border-slate-800/60">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>Skills {profile.name} Wants to Learn ({learnSkills.length})</span>
          </h2>

          {learnSkills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {learnSkills.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-white text-sm">{item.skill?.name || 'Skill'}</h3>
                    <p className="text-[11px] text-slate-400">Category: {item.skill?.category || 'General'}</p>
                  </div>
                  <SkillBadge level={item.level} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-4 rounded-xl bg-slate-950/40 border border-slate-800">
              No learning skills listed yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;
