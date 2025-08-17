import React from 'react';
import { UserLevel } from '../types';
import { BookOpenIcon, UsersIcon, PlaneIcon } from './icons';

interface ChooseLevelScreenProps {
  onSelectLevel: (level: UserLevel) => void;
}

const levels: { level: UserLevel; title: string; description: string; icon: JSX.Element, color: string }[] = [
  {
    level: 'Beginner',
    title: 'مبتدی (Beginner)',
    description: 'با اصول اولیه و عبارات رایج شروع کنید.',
    icon: <BookOpenIcon className="w-8 h-8 text-indigo-400" />,
    color: 'border-indigo-500/50 hover:bg-indigo-900/40'
  },
  {
    level: 'Intermediate',
    title: 'متوسط (Intermediate)',
    description: 'مکالمات روزمره را تمرین کنید و دایره لغات خود را گسترش دهید.',
    icon: <UsersIcon className="w-8 h-8 text-purple-400" />,
    color: 'border-purple-500/50 hover:bg-purple-900/40'
  },
  {
    level: 'Advanced',
    title: 'پیشرفته (Advanced)',
    description: 'در موضوعات پیچیده مهارت پیدا کنید و مانند یک بومی صحبت کنید.',
    icon: <PlaneIcon className="w-8 h-8 text-fuchsia-400" />,
    color: 'border-fuchsia-500/50 hover:bg-fuchsia-900/40'
  },
];

const ChooseLevelScreen: React.FC<ChooseLevelScreenProps> = ({ onSelectLevel }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-slate-100 mb-2" style={{ direction: 'rtl' }}>
        سطح خود را انتخاب کنید
      </h1>
      <p className="text-lg text-slate-300 mb-10 max-w-lg" style={{ direction: 'rtl' }}>
        نقطه شروع خود را انتخاب کنید. همیشه می‌توانید بعداً پیشرفت کنید.
      </p>

      <div className="w-full max-w-md space-y-4">
        {levels.map(({ level, title, description, icon, color }) => (
          <button
            key={level}
            onClick={() => onSelectLevel(level)}
            className={`w-full flex items-center text-right gap-4 p-4 rounded-xl shadow-md transition-all duration-200 border-2 bg-slate-800/60 backdrop-blur-sm ${color}`}
            style={{ direction: 'rtl' }}
          >
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-slate-700/70 rounded-lg">
                {icon}
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-100">{title}</h2>
                <p className="text-slate-300 text-sm">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChooseLevelScreen;
