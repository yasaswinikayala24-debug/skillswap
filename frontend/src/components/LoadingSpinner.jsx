import React from 'react';

const LoadingSpinner = ({ fullScreen = false, label = 'Loading...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-3 p-6">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      {label && <p className="text-slate-400 text-sm font-medium animate-pulse">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
