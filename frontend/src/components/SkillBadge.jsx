import React from 'react';

const SkillBadge = ({ level = 'Intermediate', type = 'default' }) => {
  const levelStyles = {
    Beginner: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Intermediate: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    Advanced: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    Expert: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  };

  const styleClass = levelStyles[level] || levelStyles.Intermediate;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styleClass}`}>
      {level}
    </span>
  );
};

export default SkillBadge;
