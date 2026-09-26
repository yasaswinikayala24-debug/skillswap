import React from 'react';

const RequestStatusBadge = ({ status = 'pending' }) => {
  const styles = {
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    accepted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
    cancelled: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  };

  const currentStyle = styles[status] || styles.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${currentStyle}`}>
      {status}
    </span>
  );
};

export default RequestStatusBadge;
