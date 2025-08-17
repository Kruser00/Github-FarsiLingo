import React, { useEffect } from 'react';
import { TrophyIcon } from './icons';
import { useUserProgress } from '../contexts/UserProgressContext';
import { playLessonCompleteSound } from '../services/soundService';

interface LessonCompleteScreenProps {
  score: number;
  total: number;
  xp: number;
  topic: string;
  onRestart: () => void;
  onGoHome: () => void;
}

const LessonCompleteScreen: React.FC<LessonCompleteScreenProps> = ({ score, total, xp, topic, onRestart, onGoHome }) => {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const { isSoundEnabled } = useUserProgress();

    useEffect(() => {
        playLessonCompleteSound(isSoundEnabled);
    }, [isSoundEnabled]);
    
    const getFeedback = () => {
        if (topic.includes('Challenge') && percentage < 80) {
            return "امتیاز کافی برای باز کردن این سطح را کسب نکردید. دوباره تلاش کنید!";
        }
        if (percentage === 100) return "فوق العاده! امتیاز کامل!";
        if (percentage >= 80) return "کارت عالی بود!";
        if (percentage >= 60) return "آفرین! به تمرین ادامه بده!";
        if (percentage >= 40) return "تلاش خوبی بود! شما در حال پیشرفت هستید.";
        return "به تلاش ادامه بده! کار نیکو کردن از پر کردن است.";
    }

    return (
        <div className="w-full flex flex-col items-center text-center p-4 md:p-8 bg-slate-900/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800/50">
            <TrophyIcon className="w-24 h-24 text-amber-400" />
            <h2 className="text-3xl md:text-4xl font-bold mt-4 text-slate-100" style={{ direction: 'rtl' }}>
                {topic.includes('Challenge') ? 'آزمون تمام شد!' : 'درس تمام شد!'}
            </h2>
            <p className="text-lg text-slate-300 mt-1" style={{ direction: 'rtl' }}>
                شما "{topic}" را به پایان رساندید.
            </p>

            <div className="mt-8 w-full max-w-sm">
                <p className="text-2xl font-bold text-purple-400" style={{ direction: 'rtl' }}>{getFeedback()}</p>
                <div className="flex items-center justify-center gap-8 mt-4">
                    <div className="flex flex-col">
                        <div className="flex items-baseline justify-center gap-2">
                            <p className="text-5xl font-bold text-slate-200">{score}</p>
                            <p className="text-2xl text-slate-400">/</p>
                            <p className="text-5xl font-bold text-slate-200">{total}</p>
                        </div>
                        <p className="text-lg font-semibold text-slate-300" style={{ direction: 'rtl' }}>امتیاز</p>
                    </div>
                     <div className="flex flex-col">
                        <p className="text-5xl font-bold text-slate-200">+{xp}</p>
                        <p className="text-lg font-semibold text-slate-300" style={{ direction: 'rtl' }}>XP</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <button
                    onClick={onRestart}
                    className="w-full px-6 py-3 rounded-xl text-lg font-bold shadow-md transition-transform hover:scale-105 bg-slate-700/80 text-slate-200 hover:bg-slate-700"
                >
                    تلاش مجدد
                </button>
                <button
                    onClick={onGoHome}
                    className="w-full px-6 py-3 rounded-xl text-lg font-bold shadow-md transition-transform hover:scale-105 bg-indigo-600 text-white hover:bg-indigo-500"
                >
                    انتخاب درس دیگر
                </button>
            </div>
        </div>
    );
};

export default LessonCompleteScreen;