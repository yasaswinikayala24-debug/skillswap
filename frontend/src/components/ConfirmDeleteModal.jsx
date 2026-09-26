import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, skillName, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-2">Remove Skill</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            Are you sure you want to remove <strong className="text-white">"{skillName}"</strong> from your profile?
          </p>
        </div>

        <div className="flex justify-center space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center space-x-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Removing...</span>
              </>
            ) : (
              <span>Remove</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
