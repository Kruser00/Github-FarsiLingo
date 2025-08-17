import React, { useState, useEffect, useCallback } from 'react';
import { Exercise, AnswerStatus, UserLevel, ExerciseType } from '../types';
import { generatePlacementTest, evaluateAnswer } from '../services/geminiService';
import { playCorrectSound, playIncorrectSound } from '../services/soundService';
import { ExerciseCard } from './ExerciseCard';
import { LessonFooter } from './LessonFooter';
import { ProgressBar } from './ProgressBar';
import { useUserProgress } from '../contexts/UserProgressContext';

interface PlacementTestScreenProps {
  onFinish: (scores: Record<UserLevel, { score: number; total: number }>) => void;
  onGoHome: () => void;
}

const PlacementTestScreen: React.FC<PlacementTestScreenProps> = ({ onFinish, onGoHome }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('UNANSWERED');
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [scores, setScores] = useState<Record<UserLevel, { score: number; total: number }>>({
    Beginner: { score: 0, total: 0 },
    Intermediate: { score: 0, total: 0 },
    Advanced: { score: 0, total: 0 },
  });
  const { isSoundEnabled } = useUserProgress();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const testExercises = await generatePlacementTest();
        if (testExercises.length === 0) {
          setError('آزمون ساخته نشد. لطفا دوباره تلاش کنید.');
        } else {
          setExercises(testExercises);
          const totals = testExercises.reduce((acc, ex) => {
            if (ex.difficulty) {
              acc[ex.difficulty].total += 1;
            }
            return acc;
          }, { Beginner: { score: 0, total: 0 }, Intermediate: { score: 0, total: 0 }, Advanced: { score: 0, total: 0 } });
          setScores(prevScores => ({
              Beginner: { ...prevScores.Beginner, total: totals.Beginner.total },
              Intermediate: { ...prevScores.Intermediate, total: totals.Intermediate.total },
              Advanced: { ...prevScores.Advanced, total: totals.Advanced.total },
          }));
        }
      } catch (e: any) {
        setError(e.message || 'خطای غیرمنتظره ای رخ داد.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, []);

  const handleContinue = useCallback(() => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setAnswerStatus('UNANSWERED');
    } else {
       onFinish(scores);
    }
  }, [currentIndex, exercises.length, onFinish, scores]);

  const handleCheckAnswer = useCallback(async () => {
    const answerToCheck = userAnswer;
    const currentExercise = exercises[currentIndex];
    if (currentExercise.type === ExerciseType.LEARN || answerStatus !== 'UNANSWERED' || !answerToCheck.trim() || isCheckingAnswer) return;

    setIsCheckingAnswer(true);
    const { type, answer, difficulty } = currentExercise;

    const typesForLenientCheck: ExerciseType[] = [ExerciseType.TRANSLATE_TO_ENGLISH, ExerciseType.TRANSLATE_TO_FARSI];
    let isCorrect = false;

    try {
        if (typesForLenientCheck.includes(type)) {
            isCorrect = await evaluateAnswer(answerToCheck, answer);
        } else {
            isCorrect = answerToCheck.trim().toLowerCase() === answer.trim().toLowerCase();
        }
    } catch(e) {
        console.error("Error during answer evaluation:", e);
        isCorrect = answerToCheck.trim().toLowerCase() === answer.trim().toLowerCase();
    }
    
    if (isCorrect) {
      playCorrectSound(isSoundEnabled);
      if (difficulty) {
        setScores(prev => ({
          ...prev,
          [difficulty]: {
            ...prev[difficulty],
            score: prev[difficulty].score + 1,
          }
        }));
      }
    } else {
      playIncorrectSound(isSoundEnabled);
    }

    setAnswerStatus(isCorrect ? 'CORRECT' : 'INCORRECT');
    setIsCheckingAnswer(false);
  }, [answerStatus, userAnswer, exercises, currentIndex, isCheckingAnswer, isSoundEnabled]);

  const handleEnterPress = useCallback(() => {
    if (answerStatus === 'UNANSWERED') {
      handleCheckAnswer();
    } else {
      handleContinue();
    }
  }, [answerStatus, handleCheckAnswer, handleContinue]);


  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-t-4 border-t-purple-500 border-gray-700 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-300" style={{ direction: 'rtl' }}>در حال آماده‌سازی آزمون تعیین سطح...</p>
        </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-rose-900/50 rounded-lg">
        <h3 className="text-xl font-bold text-rose-300" style={{ direction: 'rtl' }}>اوه! مشکلی پیش آمد.</h3>
        <p className="mt-2 text-rose-400" style={{ direction: 'rtl' }}>{error}</p>
        <button onClick={onGoHome} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            بازگشت به صفحه اصلی
        </button>
      </div>
    );
  }

  if (exercises.length === 0) {
    return null;
  }
  
  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex + 1) / exercises.length) * 100;

  return (
    <div className="w-full flex flex-col" style={{minHeight: '60vh'}}>
      <h2 className="text-2xl font-bold text-center mb-4 text-slate-100">آزمون تعیین سطح</h2>
      <ProgressBar progress={progress} />
      <div className="flex-grow flex items-center">
        <ExerciseCard
            exercise={currentExercise}
            userAnswer={userAnswer}
            onAnswerChange={setUserAnswer}
            answerStatus={answerStatus}
            onEnterPress={handleEnterPress}
        />
      </div>
      <LessonFooter
        exerciseType={currentExercise.type}
        answerStatus={answerStatus}
        onCheck={handleCheckAnswer}
        onContinue={handleContinue}
        isLastQuestion={currentIndex === exercises.length - 1}
        correctAnswer={currentExercise.answer}
        isCheckDisabled={!userAnswer.trim() || isCheckingAnswer}
        isChecking={isCheckingAnswer}
      />
    </div>
  );
};

export default PlacementTestScreen;