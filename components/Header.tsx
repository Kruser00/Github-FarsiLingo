import React from 'react';
import { HomeIcon, HeartIcon, SpeakerLoudIcon, SpeakerOffIcon } from './icons';
import { useUserProgress } from '../contexts/UserProgressContext';
import { playButtonClickSound } from '../services/soundService';

const StatItem: React.FC<{ icon: React.ReactNode; value: number | string; colorClass: string; }> = ({ icon, value, colorClass }) => (
    <div className={`flex items-center gap-1 p-1.5 md:p-2 rounded-lg bg-slate-800/50`}>
        <div className={colorClass}>{icon}</div>
        <span className="font-bold text-slate-200 text-sm md:text-md">{value}</span>
    </div>
);

export const Header: React.FC<{ onHomeClick: () => void; showHomeButton: boolean; }> = ({ onHomeClick, showHomeButton }) => {
    const { hearts, userLevel, isSoundEnabled, toggleSound } = useUserProgress();
    
    const handleToggleSound = () => {
        playButtonClickSound(!isSoundEnabled); // Play sound based on the action it's about to perform
        toggleSound();
    };

    return (
        <header className="w-full flex items-center justify-between p-2 rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 shadow-md sticky top-4 z-40">
            <div className="flex items-center gap-1 md:gap-2">
                {showHomeButton && (
                    <button onClick={onHomeClick} className="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Home">
                        <HomeIcon className="w-7 h-7 text-slate-300" />
                    </button>
                )}
                 <button onClick={handleToggleSound} className="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label={isSoundEnabled ? "Mute sounds" : "Unmute sounds"}>
                    {isSoundEnabled ? <SpeakerLoudIcon className="w-6 h-6 text-slate-300" /> : <SpeakerOffIcon className="w-6 h-6 text-slate-400" />}
                </button>
            </div>
            
            {userLevel && (
                <div className="flex items-center gap-2 md:gap-3">
                    <StatItem icon={<HeartIcon className="w-5 h-5 fill-red-500 stroke-red-500" />} value={hearts} colorClass="text-red-500" />
                </div>
            )}
        </header>
    );
};