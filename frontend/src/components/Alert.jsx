import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: {
      bg: 'bg-red-950/60 border-red-800/60 text-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
    },
    success: {
      bg: 'bg-emerald-950/60 border-emerald-800/60 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
    },
    info: {
      bg: 'bg-indigo-950/60 border-indigo-800/60 text-indigo-200',
      icon: <Info className="w-5 h-5 text-indigo-400 shrink-0" />
    }
  };

  const currentStyle = styles[type] || styles.error;

  return (
    <div className={`p-4 rounded-xl border ${currentStyle.bg} flex items-start justify-between space-x-3 mb-6 animate-fadeIn shadow-lg backdrop-blur-sm`}>
      <div className="flex items-start space-x-3">
        {currentStyle.icon}
        <span className="text-sm font-medium leading-relaxed">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-800/50"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
