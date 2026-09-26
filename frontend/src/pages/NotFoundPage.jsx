import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
        <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
      </div>
      <h1 className="text-6xl font-black text-white tracking-tight mb-2">404</h1>
      <h2 className="text-2xl font-bold text-slate-300 mb-4">Page Not Found</h2>
      <p className="text-slate-400 max-w-md mb-8 text-sm">
        The page you are looking for does not exist or has been moved. Let's get you back on track.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
