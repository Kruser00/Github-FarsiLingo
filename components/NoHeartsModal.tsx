import React, { useState } from 'react';
import { useUserProgress } from '../contexts/UserProgressContext';
import { showRewardedVideo } from '../services/adService';
import { HeartIcon, XCircleIcon, VideoIcon } from './icons';

interface NoHeartsModalProps {
  isOpen: boolean;
  onClose: () => void; // This will now function as "onQuit"
}

const AD_COOLDOWN_MINUTES = 5;

const NoHeartsModal: React.FC<NoHeartsModalProps> = ({ isOpen, onClose }) => {
    const { refillHeartsWithAd, showInfoModal, showConfirmationModal, lastAdRewardTimestamp } = useUserProgress();
    const [isAdLoading, setIsAdLoading] = useState(false);

    if (!isOpen) {
        return null;
    }
    
    const now = Date.now();
    const cooldownMs = AD_COOLDOWN_MINUTES * 60 * 1000;
    const timeSinceLastAd = now - lastAdRewardTimestamp;
    const isAdOnCooldown = timeSinceLastAd < cooldownMs;
    const remainingCooldown = cooldownMs - timeSinceLastAd;
    const remainingMinutes = Math.ceil(remainingCooldown / (1000 * 60));

    // This function will be called AFTER the user confirms they want to watch the ad.
    const performAdWatch = async () => {
        setIsAdLoading(true);
        try {
            const isRewarded = await showRewardedVideo();
            if (isRewarded) {
                refillHeartsWithAd();
                showInfoModal(
                    'قلب‌ها پر شد!',
                    'شما دوباره قلب کامل دارید. می‌توانید به درس خود ادامه دهید.'
                );
            } else {
                // The confirmation modal already warned the user, but this is a good fallback.
                showInfoModal(
                    'تبلیغ کامل نشد',
                    'برای دریافت جایزه باید کل تبلیغ را تماشا کنید.'
                );
            }
        } catch (error: any) {
            // adService provides translated error messages.
            showInfoModal('خطای تبلیغ', error.message || "یک خطای ناشناخته در تبلیغ رخ داد.");
        } finally {
            setIsAdLoading(false);
        }
    };

    // This is the new handler for the button click. It shows the confirmation modal.
    const handleWatchAdClick = () => {
        if (isAdOnCooldown) {
            showInfoModal(
                'تبلیغ در حالت استراحت',
                `شما می‌توانید برای دریافت قلب، حدود ${remainingMinutes} دقیقه دیگر تبلیغ دیگری تماشا کنید.`
            );
            return;
        }

        showConfirmationModal({
            title: 'تماشا برای جایزه',
            message: 'برای پر کردن تمام قلب‌های خود، باید ویدیوی کامل را تماشا کنید. بستن زودهنگام تبلیغ، جایزه‌ای به همراه نخواهد داشت.',
            onConfirm: performAdWatch,
            confirmText: 'تماشای ویدیو',
            cancelText: 'لغو'
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <div 
                className="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-8 text-center w-full max-w-md relative shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white" aria-label="بستن">
                    <XCircleIcon className="w-8 h-8"/>
                </button>
                <HeartIcon className="w-20 h-20 text-red-500/50 mx-auto" />
                <h2 className="text-3xl font-bold mt-4 text-slate-100" style={{direction: 'rtl'}}>
                    شما تمام قلب‌هایتان را از دست دادید!
                </h2>
                <p className="text-lg text-slate-300 mt-2 mb-6" style={{direction: 'rtl'}}>
                    برای ادامه درس، با تماشای یک تبلیغ قلب‌های خود را پر کنید یا از درس خارج شوید.
                </p>
                <div className="space-y-3">
                    <button
                        onClick={handleWatchAdClick}
                        disabled={isAdLoading || isAdOnCooldown}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-lg font-bold shadow-md transition-all hover:scale-105 bg-emerald-600 text-white hover:bg-emerald-500 disabled:bg-slate-600 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isAdLoading ? (
                           <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                        ) : (
                           <>
                               <VideoIcon className="w-6 h-6" />
                               <span>
                                   {isAdOnCooldown ? `دوباره در ${remainingMinutes} دقیقه دیگر امتحان کنید` : 'تماشای تبلیغ برای قلب'}
                               </span>
                           </>
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 rounded-xl text-lg font-bold transition-colors text-slate-300 hover:bg-slate-700/50"
                    >
                        خروج از درس
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoHeartsModal;