import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { UserLevel, UserProgress } from '../types';

const MAX_HEARTS = 5;
const HEART_REFILL_RATE_HOURS = 4;

const STORAGE_KEY = 'farsilingo_user_progress';

// XP and Leveling constants
const XP_BASE = 100;
const XP_GROWTH_RATE = 1.5;

// --- Level Calculation ---
// Calculates the total XP required to reach a specific level.
const getXpForLevel = (level: number): number => {
    if (level <= 1) return 0;
    return Math.floor(XP_BASE * Math.pow(level - 1, XP_GROWTH_RATE));
};

// Calculates the user's current level based on their total XP.
const getLevelForXp = (xp: number): number => {
    if (xp < XP_BASE) return 1;
    // Reverse the formula: level = (xp / base)^(1/growth) + 1
    return Math.floor(Math.pow(xp / XP_BASE, 1 / XP_GROWTH_RATE)) + 1;
};

interface InfoModalState {
    isOpen: boolean;
    title: string;
    message: string;
}

interface ConfirmationModalState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
}

interface UserProgressContextType extends UserProgress {
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    setUserLevel: (level: UserLevel) => void;
    addXp: (amount: number) => void;
    loseHeart: () => void;
    refillHeartsWithAd: () => void;
    toggleSound: () => void;
    markLessonAsCompleted: (topic: string, level: string) => void;
    infoModal: InfoModalState;
    confirmationModal: ConfirmationModalState;
    showInfoModal: (title: string, message: string) => void;
    hideInfoModal: () => void;
    showConfirmationModal: (config: Omit<ConfirmationModalState, 'isOpen'>) => void;
    hideConfirmationModal: () => void;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

const getDefaultProgress = (): UserProgress => ({
    xp: 0,
    level: 1,
    hearts: MAX_HEARTS,
    lastHeartRefillTimestamp: Date.now(),
    lastAdRewardTimestamp: 0,
    userLevel: null,
    isSoundEnabled: true,
    completedLessons: [],
});

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [progress, setProgress] = useState<UserProgress>(() => {
        try {
            const storedProgress = localStorage.getItem(STORAGE_KEY);
            if (storedProgress) {
                const parsed = JSON.parse(storedProgress);
                // Recalculate level on load in case the formula changes
                const level = getLevelForXp(parsed.xp || 0);
                // Merge stored progress with defaults to ensure all keys are present
                const mergedProgress = { ...getDefaultProgress(), ...parsed, level };
                // Clean up deprecated fields
                delete (mergedProgress as any).gems;
                delete (mergedProgress as any).streak;
                delete (mergedProgress as any).lastLessonDate;
                return mergedProgress;
            }
            return getDefaultProgress();
        } catch (error) {
            console.error("Failed to parse user progress from localStorage", error);
            return getDefaultProgress();
        }
    });
    
    const [infoModal, setInfoModal] = useState<InfoModalState>({ isOpen: false, title: '', message: '' });
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalState>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    useEffect(() => {
        // This effect runs on initial load to handle timed heart refills.
        const now = Date.now();
        const { hearts, lastHeartRefillTimestamp } = progress;

        if (hearts < MAX_HEARTS) {
            const hoursPassed = (now - lastHeartRefillTimestamp) / (1000 * 60 * 60);
            const heartsToRefill = Math.floor(hoursPassed / HEART_REFILL_RATE_HOURS);
            
            if (heartsToRefill > 0) {
                setProgress(prev => {
                    const newHearts = Math.min(MAX_HEARTS, prev.hearts + heartsToRefill);
                    const newTimestamp = prev.lastHeartRefillTimestamp + (heartsToRefill * HEART_REFILL_RATE_HOURS * 1000 * 60 * 60);
                    return { ...prev, hearts: newHearts, lastHeartRefillTimestamp: newTimestamp };
                });
            }
        }
    }, []); // Run only once on mount

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error("Failed to save user progress to localStorage", error);
        }
    }, [progress]);
    
    const showInfoModal = useCallback((title: string, message: string) => {
        setInfoModal({ isOpen: true, title, message });
    }, []);

    const hideInfoModal = useCallback(() => {
        setInfoModal(prev => ({ ...prev, isOpen: false }));
    }, []);

    const showConfirmationModal = useCallback((config: Omit<ConfirmationModalState, 'isOpen'>) => {
        setConfirmationModal({ ...config, isOpen: true });
    }, []);

    const hideConfirmationModal = useCallback(() => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
    }, []);


    const setUserLevel = useCallback((level: UserLevel) => {
        setProgress(prev => ({ ...prev, userLevel: level }));
    }, []);

    const addXp = useCallback((amount: number) => {
        setProgress(prev => {
            const newXp = prev.xp + amount;
            const newLevel = getLevelForXp(newXp);
            return { ...prev, xp: newXp, level: newLevel };
        });
    }, []);

    const loseHeart = useCallback(() => {
        setProgress(prev => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));
    }, []);

    const refillHeartsWithAd = useCallback(() => {
        setProgress(prev => ({
            ...prev,
            hearts: MAX_HEARTS,
            lastHeartRefillTimestamp: Date.now(),
            lastAdRewardTimestamp: Date.now(),
        }));
    }, []);
    
    const toggleSound = useCallback(() => {
        setProgress(prev => ({ ...prev, isSoundEnabled: !prev.isSoundEnabled }));
    }, []);
    
    const markLessonAsCompleted = useCallback((topic: string, level: string) => {
        const lessonId = `${level}-${topic}`;
        setProgress(prev => {
            if (prev.completedLessons.includes(lessonId)) {
                return prev;
            }
            const newCompletedLessons = [...prev.completedLessons, lessonId];
            return { ...prev, completedLessons: newCompletedLessons };
        });
    }, []);
    
    const xpForCurrentLevel = getXpForLevel(progress.level);
    const xpForNextLevel = getXpForLevel(progress.level + 1);


    return (
        <UserProgressContext.Provider value={{ 
            ...progress, 
            xpForCurrentLevel, 
            xpForNextLevel, 
            setUserLevel, 
            addXp, 
            loseHeart, 
            refillHeartsWithAd, 
            toggleSound,
            markLessonAsCompleted,
            infoModal,
            confirmationModal,
            showInfoModal,
            hideInfoModal,
            showConfirmationModal,
            hideConfirmationModal
        }}>
            {children}
        </UserProgressContext.Provider>
    );
};

export const useUserProgress = (): UserProgressContextType => {
    const context = useContext(UserProgressContext);
    if (context === undefined) {
        throw new Error('useUserProgress must be used within a UserProgressProvider');
    }
    return context;
};
