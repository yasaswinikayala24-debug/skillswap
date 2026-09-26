import React from 'react';
import { Repeat, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/60 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Repeat className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">SkillSwap</span>
            <span className="text-slate-500 text-sm">| Learn. Teach. Exchange.</span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-slate-400">
            <span>© {new Date().getFullYear()} SkillSwap. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-1 text-xs text-slate-500">
            <span>Built for peer-to-peer knowledge sharing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
