import React from 'react';

interface UpdatePromptProps {
  show: boolean;
  onUpdate: () => void;
}

const UpdatePrompt: React.FC<UpdatePromptProps> = ({ show, onUpdate }) => {
  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-2xl bg-slate-800/80 backdrop-blur-lg border border-slate-700/50 text-white animate-slide-in-up"
      role="alert"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-slate-200 font-semibold">A new version is available!</p>
        <button
          onClick={onUpdate}
          className="px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-transform hover:scale-105 bg-indigo-600 text-white hover:bg-indigo-500 flex-shrink-0"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default UpdatePrompt;
