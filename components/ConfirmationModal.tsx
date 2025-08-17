import React from 'react';
import { XCircleIcon, AlertTriangleIcon } from './icons';
import { playButtonClickSound } from '../services/soundService';
import { useUserProgress } from '../contexts/UserProgressContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'تایید', cancelText = 'لغو' }) => {
    const { isSoundEnabled } = useUserProgress();

    if (!isOpen) {
        return null;
    }
    
    const handleConfirm = () => {
        playButtonClickSound(isSoundEnabled);
        onConfirm();
    }
    
    const handleClose = () => {
        playButtonClickSound(isSoundEnabled);
        onClose();
    }

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-8 text-center w-full max-w-md relative shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={handleClose} className="absolute top-3 right-3 text-slate-400 hover:text-white" aria-label="بستن">
                    <XCircleIcon className="w-8 h-8"/>
                </button>
                <div className="w-20 h-20 mx-auto flex items-center justify-center bg-amber-500/20 rounded-full border-2 border-amber-500/50">
                    <AlertTriangleIcon className="w-12 h-12 text-amber-400" />
                </div>
                <h2 className="text-3xl font-bold mt-4 text-slate-100" style={{direction: 'rtl'}}>
                    {title}
                </h2>
                <p className="text-lg text-slate-300 mt-2 mb-8" style={{direction: 'rtl'}}>
                    {message}
                </p>
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <button
                        onClick={handleClose}
                        className="w-full px-6 py-3 rounded-xl text-lg font-bold transition-colors text-slate-300 hover:bg-slate-700/50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="w-full px-6 py-3 rounded-xl text-lg font-bold shadow-md transition-transform hover:scale-105 bg-indigo-600 text-white hover:bg-indigo-500"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
