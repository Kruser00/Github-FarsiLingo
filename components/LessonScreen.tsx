import React, { useState, useEffect, useCallback } from 'react';
import { Exercise, AnswerStatus, ExerciseType } from '../types';
import { generateLesson, evaluateAnswer } from '../services/geminiService';
import { playCorrectSound, playIncorrectSound, playHeartLostSound } from '../services/soundService';
import { preloadRewardedVideo } from '../services/adService';
import { ExerciseCard } from './ExerciseCard';
import { LessonFooter } from './LessonFooter';
import { ProgressBar } from './ProgressBar';
import { useUserProgress } from '../contexts/UserProgressContext';
import NoHeartsModal from './NoHeartsModal';

const LESSON_SESSION_KEY = 'farsilingo_lesson_session';

interface LessonSessionState {
  exercises: Exercise[];
  currentIndex: number;
  correctAnswers: number;
  sessionXp: number;
  topic: string;
  level: string;
}

interface LessonScreenProps {
  topic: string;
  level: string;
  onFinish: (score: number, total: number, xp: number) => void;
}

const LessonScreen: React.FC<LessonScreenProps> = ({ topic, level, onFinish }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('UNANSWERED');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const [isOutOfHearts, setIsOutOfHearts] = useState(false);

  const { hearts, loseHeart, addXp, isSoundEnabled } = useUserProgress();
  
  useEffect(() => {
    preloadRewardedVideo();
  }, []);

  // Effect to save lesson progress to sessionStorage
  useEffect(() => {
    if (isLoading || exercises.length === 0) {
      return;
    }
    const lessonState: LessonSessionState = {
      exercises,
      currentIndex,
      correctAnswers,
      sessionXp,
      topic,
      level,
    };
    try {
      sessionStorage.setItem(LESSON_SESSION_KEY, JSON.stringify(lessonState));
    } catch (e) {
      console.error("Could not save lesson session state.", e);
    }
  }, [exercises, currentIndex, correctAnswers, sessionXp, topic, level, isLoading]);

  useEffect(() => {
    const fetchOrRestoreLesson = async () => {
      // 1. Try to restore from session storage
      try {
        const savedStateRaw = sessionStorage.getItem(LESSON_SESSION_KEY);
        if (savedStateRaw) {
          const savedState: LessonSessionState = JSON.parse(savedStateRaw);
          if (savedState.topic === topic && savedState.level === level) {
            console.log("Restoring lesson from session.");
            setExercises(savedState.exercises);
            setCurrentIndex(savedState.currentIndex);
            setCorrectAnswers(savedState.correctAnswers);
            setSessionXp(savedState.sessionXp);
            setIsLoading(false);
            return;
          } else {
            sessionStorage.removeItem(LESSON_SESSION_KEY);
          }
        }
      } catch (e) {
        console.error("Could not restore lesson from session. Fetching new lesson.", e);
        sessionStorage.removeItem(LESSON_SESSION_KEY);
      }

      // 2. If restore fails, fetch a new lesson
      try {
        setIsLoading(true);
        setError(null);
        const lessonExercises = await generateLesson(topic, level);
        if (lessonExercises.length === 0) {
          setError('درسی برای این موضوع ساخته نشد. لطفا موضوع دیگری را امتحان کنید.');
        } else {
          setExercises(lessonExercises);
        }
      } catch (e: any) {
        setError(e.message || 'خطای غیرمنتظره ای رخ داد.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrRestoreLesson();
  }, [topic, level]);

  useEffect(() => {
    if (exercises.length > 0 && hearts <= 0) {
        setIsOutOfHearts(true);
    } else {
        setIsOutOfHearts(false);
    }
  }, [hearts, exercises.length]);

  const handleContinue = useCallback(() => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setAnswerStatus('UNANSWERED');
    } else {
       // For alphabet lesson, all answers are "correct" in terms of progression
       const totalQuestions = exercises.filter(ex => ex.type !== ExerciseType.LEARN).length;
       const finalScore = topic === 'The Alphabet' ? totalQuestions : correctAnswers;
       onFinish(finalScore, totalQuestions, sessionXp);
    }
  }, [currentIndex, exercises.length, onFinish, correctAnswers, sessionXp, topic]);

  const handleCheckAnswer = useCallback(async () => {
    const answerToCheck = userAnswer;
    const currentExercise = exercises[currentIndex];
    if (currentExercise.type === ExerciseType.LEARN || currentExercise.type === ExerciseType.ALPHABET_PRACTICE || answerStatus !== 'UNANSWERED' || !answerToCheck.trim() || isCheckingAnswer) return;
    
    setIsCheckingAnswer(true);
    const { type, answer } = currentExercise;

    const typesForLenientCheck: ExerciseType[] = [ExerciseType.TRANSLATE_TO_ENGLISH, ExerciseType.TRANSLATE_TO_FARSI];
    let isCorrect = false;

    try {
        if (typesForLenientCheck.includes(type)) {
            isCorrect = await evaluateAnswer(answerToCheck, answer);
        } else {
            isCorrect = answerToCheck.trim().toLowerCase() === answer.trim().toLowerCase();
        }
    } catch (e) {
        console.error("Error during answer evaluation:", e);
        isCorrect = answerToCheck.trim().toLowerCase() === answer.trim().toLowerCase();
    }
    
    if (isCorrect) {
      playCorrectSound(isSoundEnabled);
      setAnswerStatus('CORRECT');
      setCorrectAnswers(prev => prev + 1);
      const xpGained = 10;
      setSessionXp(prev => prev + xpGained);
      addXp(xpGained);
    } else {
      playIncorrectSound(isSoundEnabled);
      playHeartLostSound(isSoundEnabled);
      loseHeart();
      setAnswerStatus('INCORRECT');
    }
    setIsCheckingAnswer(false);
  }, [answerStatus, userAnswer, exercises, currentIndex, isCheckingAnswer, loseHeart, addXp, isSoundEnabled]);

  const handleEnterPress = useCallback(() => {
    const currentExercise = exercises[currentIndex];
    if (currentExercise.type === ExerciseType.LEARN || currentExercise.type === ExerciseType.ALPHABET_PRACTICE) {
      handleContinue();
      return;
    }
    if (answerStatus === 'UNANSWERED') {
      handleCheckAnswer();
    } else {
      handleContinue();
    }
  }, [exercises, currentIndex, answerStatus, handleCheckAnswer, handleContinue]);
  
  const handleQuitLesson = () => {
    onFinish(correctAnswers, exercises.length, sessionXp);
  }

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-t-4 border-t-purple-500 border-gray-700 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-300" style={{ direction: 'rtl' }}>در حال ساخت درس {level} شما در مورد "{topic}"...</p>
        </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-rose-900/50 rounded-lg">
        <h3 className="text-xl font-bold text-rose-300" style={{ direction: 'rtl' }}>اوه! مشکلی پیش آمد.</h3>
        <p className="mt-2 text-rose-400" style={{ direction: 'rtl' }}>{error}</p>
        <button onClick={() => onFinish(0, 0, 0)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            بازگشت
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
    <>
      <NoHeartsModal isOpen={isOutOfHearts} onClose={handleQuitLesson} />
      <div className={`w-full flex flex-col ${isOutOfHearts ? 'opacity-50 pointer-events-none' : ''}`} style={{minHeight: '60vh'}}>
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
    </>
  );
};

export default LessonScreen;