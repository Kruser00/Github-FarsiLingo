import React from 'react';
import { XCircleIcon, InfoIcon } from './icons';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-8 text-center w-full max-w-md relative shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white" aria-label="بستن">
                    <XCircleIcon className="w-8 h-8"/>
                </button>
                <div className="w-20 h-20 mx-auto flex items-center justify-center bg-blue-500/20 rounded-full border-2 border-blue-500/50">
                    <InfoIcon className="w-12 h-12 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold mt-4 text-slate-100" style={{direction: 'rtl'}}>
                    {title}
                </h2>
                <p className="text-lg text-slate-300 mt-2 mb-8" style={{direction: 'rtl'}}>
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="w-full mt-4 px-6 py-3 rounded-xl text-lg font-bold transition-all hover:scale-105 bg-indigo-600 text-white hover:bg-indigo-500"
                >
                    متوجه شدم
                </button>
            </div>
        </div>
    );
};

export default InfoModal;