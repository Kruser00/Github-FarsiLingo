import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import HomeScreen from './components/HomeScreen';
import LessonScreen from './components/LessonScreen';
import LessonCompleteScreen from './components/LessonCompleteScreen';
import PlacementTestScreen from './components/PlacementTestScreen';
import PlacementTestCompleteScreen from './components/PlacementTestCompleteScreen';
import ChooseLevelScreen from './components/ChooseLevelScreen';
import { Header } from './components/Header';
import { AppView, UserLevel } from './types';
import { UserProgressProvider, useUserProgress } from './contexts/UserProgressContext';
import InfoModal from './components/InfoModal';
import ConfirmationModal from './components/ConfirmationModal';
import AnimatedBackground from './components/AnimatedBackground';
import SplashScreen from './components/SplashScreen';
import UpdatePrompt from './components/UpdatePrompt';

const APP_SESSION_KEY = 'farsilingo_app_session';
const LESSON_SESSION_KEY = 'farsilingo_lesson_session';

interface AppSession {
  currentView: AppView;
  currentLesson: { topic: string; level: string } | null;
  lessonResult: { score: number; total: number; xp: number } | null;
  placementTestLevel: UserLevel | null;
}

const AppContent: React.FC = () => {
  const { 
    userLevel, 
    setUserLevel, 
    addXp,
    markLessonAsCompleted,
    infoModal, 
    hideInfoModal,
    confirmationModal,
    hideConfirmationModal
  } = useUserProgress();

  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const savedSessionRaw = sessionStorage.getItem(APP_SESSION_KEY);
      if (savedSessionRaw) {
        const savedSession: AppSession = JSON.parse(savedSessionRaw);
        if (savedSession.currentView && (savedSession.currentView === 'START' || userLevel)) {
          return savedSession.currentView;
        }
      }
    } catch (e) { console.error("Could not parse session view", e); }
    return userLevel ? 'HOME' : 'START';
  });
  
  const [currentLesson, setCurrentLesson] = useState<{ topic: string; level: string } | null>(() => {
    try {
      const savedSessionRaw = sessionStorage.getItem(APP_SESSION_KEY);
      if (savedSessionRaw) return JSON.parse(savedSessionRaw).currentLesson || null;
    } catch (e) { /* ignore */ }
    return null;
  });

  const [lessonResult, setLessonResult] = useState<{ score: number, total: number, xp: number } | null>(() => {
    try {
      const savedSessionRaw = sessionStorage.getItem(APP_SESSION_KEY);
      if (savedSessionRaw) return JSON.parse(savedSessionRaw).lessonResult || null;
    } catch (e) { /* ignore */ }
    return null;
  });

  const [placementTestLevel, setPlacementTestLevel] = useState<UserLevel | null>(() => {
    try {
      const savedSessionRaw = sessionStorage.getItem(APP_SESSION_KEY);
      if (savedSessionRaw) return JSON.parse(savedSessionRaw).placementTestLevel || null;
    } catch (e) { /* ignore */ }
    return null;
  });

  const [lessonKey, setLessonKey] = useState<number>(0);

  // Save state to session storage whenever it changes
  useEffect(() => {
    const sessionState: AppSession = {
      currentView,
      currentLesson,
      lessonResult,
      placementTestLevel,
    };
    try {
      // Don't save if we are on start screen and have a user level, which means we are resetting.
      if (currentView === 'START' && userLevel) {
          sessionStorage.removeItem(APP_SESSION_KEY);
          return;
      }
      sessionStorage.setItem(APP_SESSION_KEY, JSON.stringify(sessionState));
    } catch (e) {
      console.error("Could not save app session state.", e);
    }
  }, [currentView, currentLesson, lessonResult, placementTestLevel, userLevel]);


  const startLesson = (topic: string, level: string) => {
    setCurrentLesson({ topic, level });
    setCurrentView('LESSON');
    setLessonKey(prevKey => prevKey + 1);
  };

  const handleLessonFinish = (score: number, total: number, xp: number) => {
    sessionStorage.removeItem(LESSON_SESSION_KEY);
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    
    // Mark lesson as completed for progression if score is high enough
    if (userLevel && currentLesson && percentage >= 80) {
        markLessonAsCompleted(currentLesson.topic, currentLesson.level);
    }

    // Handle level-up challenges
    if (userLevel && currentLesson?.topic.includes('Challenge') && percentage >= 80) {
        const levelRanks: Record<UserLevel, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        const unlockedLevel = currentLesson.level as UserLevel;
        if (levelRanks[unlockedLevel] > levelRanks[userLevel]) {
             setUserLevel(unlockedLevel);
        }
    }

    setLessonResult({ score, total, xp });
    setCurrentView('LESSON_COMPLETE');
  };

  const restartLesson = () => {
    if (currentLesson) {
        startLesson(currentLesson.topic, currentLesson.level);
    }
  };

  const goHome = () => {
    sessionStorage.removeItem(LESSON_SESSION_KEY);
    setCurrentLesson(null);
    setLessonResult(null);
    setCurrentView('HOME');
  };

  const goToStart = () => {
    sessionStorage.removeItem(LESSON_SESSION_KEY);
    sessionStorage.removeItem(APP_SESSION_KEY);
    setCurrentLesson(null);
    setLessonResult(null);
    setCurrentView('START');
  }

  const handleStartPlacementTest = () => setCurrentView('PLACEMENT_TEST');
  
  const handleChooseLevel = () => {
    setCurrentView('CHOOSE_LEVEL');
  };

  const handleLevelSelected = (level: UserLevel) => {
    setUserLevel(level);
    setCurrentView('HOME');
  };

  const handlePlacementTestFinish = (scores: Record<UserLevel, { score: number; total: number }>) => {
    let determinedLevel: UserLevel = 'Beginner';
    const advancedPassed = scores.Advanced.total > 0 && (scores.Advanced.score / scores.Advanced.total) >= 0.66;
    const intermediatePassed = scores.Intermediate.total > 0 && (scores.Intermediate.score / scores.Intermediate.total) >= 0.66;

    if (advancedPassed) {
        determinedLevel = 'Advanced';
    } else if (intermediatePassed) {
        determinedLevel = 'Intermediate';
    } else {
        determinedLevel = 'Beginner';
    }
    
    setPlacementTestLevel(determinedLevel);
    setUserLevel(determinedLevel);
    setCurrentView('PLACEMENT_TEST_COMPLETE');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'START':
        return <StartScreen onStartTest={handleStartPlacementTest} onChooseLevel={handleChooseLevel} />;
      case 'CHOOSE_LEVEL':
        return <ChooseLevelScreen onSelectLevel={handleLevelSelected} />;
      case 'PLACEMENT_TEST':
        return <PlacementTestScreen onFinish={handlePlacementTestFinish} onGoHome={goToStart} />;
      case 'PLACEMENT_TEST_COMPLETE':
        if (placementTestLevel) {
          return <PlacementTestCompleteScreen level={placementTestLevel} onContinue={goHome} />;
        }
        return null;
      case 'HOME':
        return <HomeScreen onStartLesson={startLesson} userLevel={userLevel} />;
      case 'LESSON':
        if (currentLesson) {
          return <LessonScreen key={lessonKey} topic={currentLesson.topic} level={currentLesson.level} onFinish={handleLessonFinish} />;
        }
        return null;
      case 'LESSON_COMPLETE':
        if (lessonResult && currentLesson) {
          return <LessonCompleteScreen 
            score={lessonResult.score}
            total={lessonResult.total}
            xp={lessonResult.xp}
            topic={currentLesson.topic}
            onRestart={restartLesson}
            onGoHome={goHome}
          />;
        }
        return null;
      default:
        return <StartScreen onStartTest={handleStartPlacementTest} onChooseLevel={handleChooseLevel} />;
    }
  }

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-200 flex flex-col items-center p-4 selection:bg-purple-400/50">
        <div className="w-full max-w-2xl mx-auto">
          <Header onHomeClick={goHome} showHomeButton={currentView !== 'HOME' && !!userLevel} />
          <main key={currentView} className="mt-8 main-content-fade-in">
            {renderContent()}
          </main>
        </div>
      </div>
      <InfoModal
        isOpen={infoModal.isOpen}
        title={infoModal.title}
        message={infoModal.message}
        onClose={hideInfoModal}
      />
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        onConfirm={() => {
            confirmationModal.onConfirm();
            hideConfirmationModal();
        }}
        onClose={hideConfirmationModal}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
      />
    </>
  );
};


const App: React.FC = () => {
    const [isInitializing, setIsInitializing] = useState(true);
    const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

    useEffect(() => {
        // PWA Service Worker update logic
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('FarsiLingo PWA Service Worker registered: ', registration);
                
                // This will be called if a new service worker is waiting to activate.
                // This can happen if the user opens the PWA in a new tab, and an update
                // was already downloaded but not activated in another tab.
                if (registration.waiting) {
                    setWaitingWorker(registration.waiting);
                    setShowUpdatePrompt(true);
                }

                // This is called when a new service worker is found and starts installing.
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    if (installingWorker) {
                        installingWorker.onstatechange = () => {
                            // When the new worker is installed and a previous worker is controlling the page,
                            // show the update prompt.
                            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                setWaitingWorker(installingWorker);
                                setShowUpdatePrompt(true);
                            }
                        };
                    }
                };
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });

            // This is called when the new service worker has taken control.
            // We reload the page to ensure the user gets the latest assets.
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    window.location.reload();
                    refreshing = true;
                }
            });
        }
        
        // Simulate loading time for assets, etc.
        const timer = setTimeout(() => {
            setIsInitializing(false);
        }, 2000); // Show splash for 2 seconds

        return () => clearTimeout(timer);
    }, []);
    
    const handleUpdate = () => {
        if (waitingWorker) {
            // Send a message to the waiting service worker to activate immediately.
            waitingWorker.postMessage({ type: 'SKIP_WAITING' });
            setShowUpdatePrompt(false);
        }
    };


    if (isInitializing) {
        return <SplashScreen />;
    }

    return (
        <UserProgressProvider>
            <AppContent />
            <UpdatePrompt show={showUpdatePrompt} onUpdate={handleUpdate} />
        </UserProgressProvider>
    );
};


export default App;
