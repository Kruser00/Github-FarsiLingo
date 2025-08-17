import React from 'react';
import { AnswerStatus, ExerciseType } from '../types';
import { CheckCircleIcon, XCircleIcon, HeartIcon } from './icons';
import { useUserProgress } from '../contexts/UserProgressContext';
import { playButtonClickSound, triggerHapticFeedback } from '../services/soundService';

interface LessonFooterProps {
  exerciseType: ExerciseType;
  answerStatus: AnswerStatus;
  onCheck: () => void;
  onContinue: () => void;
  isLastQuestion: boolean;
  correctAnswer: string;
  isCheckDisabled?: boolean;
  isChecking?: boolean;
}

export const LessonFooter: React.FC<LessonFooterProps> = ({ exerciseType, answerStatus, onCheck, onContinue, isLastQuestion, correctAnswer, isCheckDisabled = false, isChecking = false }) => {
  const { isSoundEnabled } = useUserProgress();
  
  const handleCheckClick = () => {
    playButtonClickSound(isSoundEnabled);
    triggerHapticFeedback(isSoundEnabled);
    onCheck();
  };

  const handleContinueClick = () => {
    playButtonClickSound(isSoundEnabled);
    triggerHapticFeedback(isSoundEnabled);
    onContinue();
  };
  
  if (exerciseType === ExerciseType.LEARN || exerciseType === ExerciseType.ALPHABET_PRACTICE) {
    return (
        <footer className="w-full p-4 bg-slate-900/10 rounded-t-2xl border-t border-slate-700/50">
            <div className="w-full max-w-2xl mx-auto flex items-center justify-end">
                <button
                    onClick={handleContinueClick}
                    className="px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition-transform hover:scale-105 bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                    {isLastQuestion ? 'پایان' : 'ادامه'}
                </button>
            </div>
        </footer>
    );
  }

  const renderFeedback = () => {
    if (answerStatus === 'CORRECT') {
      return (
        <div className="flex items-center gap-3">
          <CheckCircleIcon className="w-8 h-8 text-teal-400" />
          <p className="text-xl font-bold text-teal-400">عالی!</p>
        </div>
      );
    }
    if (answerStatus === 'INCORRECT') {
      return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3" style={{direction: 'rtl'}}>
          <div className="flex items-center gap-3">
            <XCircleIcon className="w-8 h-8 text-rose-400" />
            <p className="text-xl font-bold text-rose-400">پاسخ صحیح:</p>
            <div className="flex items-center gap-1 p-1 px-2 rounded-md bg-rose-500/20">
                <HeartIcon className="w-4 h-4 text-rose-400"/>
                <span className="font-bold text-sm text-rose-300">-1</span>
            </div>
          </div>
          <p className="font-semibold text-rose-300" style={{direction: 'ltr'}}>{correctAnswer}</p>
        </div>
      );
    }
    return null;
  };
  
  const getButtonClass = () => {
      if (answerStatus === 'UNANSWERED') return 'bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed';
      if (answerStatus === 'CORRECT') return 'bg-teal-600 hover:bg-teal-500 text-white';
      if (answerStatus === 'INCORRECT') return 'bg-rose-600 hover:bg-rose-500 text-white';
      return '';
  }

  return (
    <footer className={`w-full p-4 transition-colors duration-300 rounded-t-2xl border-t border-slate-700/50
        ${answerStatus === 'CORRECT' ? 'bg-teal-500/15 backdrop-blur-sm' : ''}
        ${answerStatus === 'INCORRECT' ? 'bg-rose-500/15 backdrop-blur-sm' : ''}
        ${answerStatus === 'UNANSWERED' ? 'bg-slate-900/10' : ''}
    `}>
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between">
            <div className="h-12 flex items-center">{renderFeedback()}</div>
            {answerStatus === 'UNANSWERED' ? (
                <button
                    onClick={handleCheckClick}
                    disabled={isCheckDisabled}
                    className={`px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition-all hover:scale-105 flex items-center justify-center min-w-[120px] ${getButtonClass()}`}
                >
                    {isChecking ? <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : 'بررسی پاسخ'}
                </button>
            ) : (
                <button
                    onClick={handleContinueClick}
                    className={`px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition-transform hover:scale-105 ${getButtonClass()}`}
                >
                    {isLastQuestion ? 'پایان' : 'ادامه'}
                </button>
            )}
        </div>
    </footer>
  );
};