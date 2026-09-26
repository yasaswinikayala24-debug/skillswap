import React from 'react';

const MetricCard = ({ title, value = 0, icon: Icon, badgeText = 'Phase 2', color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
    emerald: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    sky: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400',
  };

  const selectedColor = colorClasses[color] || colorClasses.indigo;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${selectedColor} p-6 border backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300">
          {badgeText}
        </span>
        {Icon && (
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-extrabold text-white mb-1 tracking-tight">{value}</p>
        <h3 className="text-sm font-medium text-slate-300">{title}</h3>
      </div>
    </div>
  );
};

export default MetricCard;
