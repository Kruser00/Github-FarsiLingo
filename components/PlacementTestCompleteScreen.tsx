import React from 'react';
import { UserLevel } from '../types';
import { TrophyIcon, ArrowRightIcon } from './icons';

const PlacementTestCompleteScreen: React.FC<{ level: UserLevel, onContinue: () => void }> = ({ level, onContinue }) => {
    
    const levelInfo = {
        Beginner: {
            title: 'مبتدی (Beginner)',
            description: 'شما اصول اولیه را درک کرده‌اید. عالی برای شروع!',
            color: 'text-indigo-400',
        },
        Intermediate: {
            title: 'متوسط (Intermediate)',
            description: 'شما در میانه راه هستید! می‌توانید مکالمات روزمره را انجام دهید.',
            color: 'text-purple-400',
        },
        Advanced: {
            title: 'پیشرفته (Advanced)',
            description: 'کارتان عالی است! شما برای موضوعات پیچیده آماده هستید.',
            color: 'text-fuchsia-400',
        }
    }

    const currentLevelInfo = levelInfo[level];

    return (
        <div className="w-full flex flex-col items-center text-center p-4 md:p-8 bg-slate-900/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800/50">
            <TrophyIcon className="w-24 h-24 text-amber-400" />
            <h2 className="text-3xl md:text-4xl font-bold mt-4 text-slate-100" style={{ direction: 'rtl' }}>
                آزمون تمام شد!
            </h2>
            <p className="text-lg text-slate-300 mt-2" style={{ direction: 'rtl' }}>
                سطح پیشنهادی برای شما:
            </p>

            <div className={`mt-6 mb-8 p-4 rounded-lg w-full max-w-sm`}>
                <h3 className={`text-3xl font-bold ${currentLevelInfo.color}`}>{currentLevelInfo.title}</h3>
                <p className="text-slate-300 mt-2" style={{direction: 'rtl'}}>{currentLevelInfo.description}</p>
            </div>
            
            <button
                onClick={onContinue}
                className="w-full max-w-xs flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-lg font-bold shadow-md transition-transform hover:scale-105 bg-indigo-600 text-white hover:bg-indigo-500"
            >
                ادامه و شروع یادگیری
                <ArrowRightIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default PlacementTestCompleteScreen;
