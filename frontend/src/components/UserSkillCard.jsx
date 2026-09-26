import React from 'react';
import { Link } from 'react-router-dom';
import SkillBadge from './SkillBadge';
import { User, GraduationCap, BookOpen, ExternalLink } from 'lucide-react';

const UserSkillCard = ({ user }) => {
  if (!user) return null;

  const teachSkills = user.skillsToTeach || [];
  const learnSkills = user.skillsToLearn || [];

  return (
    <div className="rounded-2xl bg-slate-800/40 border border-slate-700/60 p-6 backdrop-blur-md flex flex-col justify-between space-y-6 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl">
      <div>
        {/* User Header */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 border-2 border-indigo-500/40 shrink-0 flex items-center justify-center text-slate-300 shadow-md">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <User className="w-7 h-7" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{user.name}</h3>
            <span className="text-xs text-indigo-400 font-medium">Role: {user.role || 'Student'}</span>
            {user.bio && (
              <p className="text-xs text-slate-400 line-clamp-2 mt-1 italic">"{user.bio}"</p>
            )}
          </div>
        </div>

        {/* Skills I Can Teach */}
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>Skills I Teach ({teachSkills.length})</span>
          </h4>
          {teachSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {teachSkills.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
                  <span className="font-semibold text-slate-200">{item.skill?.name || 'Skill'}</span>
                  <SkillBadge level={item.level} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No teaching skills listed yet.</p>
          )}
        </div>

        {/* Skills I Want to Learn */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Skills I Want to Learn ({learnSkills.length})</span>
          </h4>
          {learnSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {learnSkills.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
                  <span className="font-semibold text-slate-200">{item.skill?.name || 'Skill'}</span>
                  <SkillBadge level={item.level} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No learning skills listed yet.</p>
          )}
        </div>
      </div>

      {/* Footer link to public profile */}
      <div className="pt-4 border-t border-slate-700/50 flex justify-end">
        <Link
          to={`/user/${user._id}`}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold text-xs border border-indigo-500/30 transition-all"
        >
          <span>View Public Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default UserSkillCard;
