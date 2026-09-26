import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ArrowRight, Tag } from 'lucide-react';

const SkillCard = ({ skill }) => {
  if (!skill) return null;

  return (
    <div className="group relative rounded-2xl bg-slate-800/40 border border-slate-700/60 p-6 backdrop-blur-md flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-semibold uppercase tracking-wider">
            <Tag className="w-3 h-3" />
            <span>{skill.category || 'General'}</span>
          </span>
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>{(skill.teacherCount || 0) + (skill.learnerCount || 0)} swappers</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
          {skill.name}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
          {skill.description || `Explore peers offering and learning ${skill.name} on SkillSwap.`}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          <span className="text-emerald-400 font-semibold">{skill.teacherCount || 0}</span> teachers •{' '}
          <span className="text-indigo-400 font-semibold">{skill.learnerCount || 0}</span> learners
        </div>

        <Link
          to={`/find-people?skill=${encodeURIComponent(skill.name)}`}
          className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span>Find People</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default SkillCard;
