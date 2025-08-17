import React from 'react';
import { BookOpenIcon, UtensilsIcon, PlaneIcon, ShoppingCartIcon, UsersIcon, CalendarIcon, BriefcaseIcon, UserIcon, CalendarDaysIcon, HeartIcon, MapPinIcon, MessageSquareIcon, LockIcon, ClockIcon, HelpCircleIcon, ArchiveIcon, CloudIcon, HeartPulseIcon, HourglassIcon, ScaleIcon, QuoteIcon, GlobeIcon, PaletteIcon, AppleIcon, SmileIcon, ShoppingBagIcon, CompassIcon, HouseIcon, BusIcon, CheckCircleIcon, TrophyIcon, BrainCircuitIcon, BeakerIcon } from './icons';
import { UserLevel } from '../types';
import { useUserProgress } from '../contexts/UserProgressContext';
import { playButtonClickSound, triggerHapticFeedback } from '../services/soundService';

interface HomeScreenProps {
  onStartLesson: (topic: string, level: string) => void;
  userLevel: UserLevel | null; // From placement test or chosen
}

const levelRanks: Record<UserLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

const LevelProgress: React.FC = () => {
    const { level, xp, xpForCurrentLevel, xpForNextLevel } = useUserProgress();
    
    const xpInCurrentLevel = xp - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
    const progressPercentage = xpNeededForNextLevel > 0 ? (xpInCurrentLevel / xpNeededForNextLevel) * 100 : 100;

    return (
        <div className="w-full bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-indigo-400">سطح {level}</span>
                <span className="text-sm font-semibold text-slate-300" style={{direction: 'rtl'}}>
                    {xpInCurrentLevel.toLocaleString()} / {xpNeededForNextLevel.toLocaleString()} XP
                </span>
            </div>
            <div className="w-full bg-slate-700/70 rounded-full h-3">
                <div
                    className="bg-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};

const difficultyLevels = [
  {
    level: 'Beginner' as UserLevel,
    description: 'با اصول اولیه شروع کنید.',
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    units: [
      {
        name: 'Unit 1: The Absolute Basics',
        farsiName: 'واحد ۱: مبانی اولیه',
        topics: [
          { name: 'The Alphabet', farsiName: 'الفبا', icon: <div className="w-8 h-8 text-2xl font-bold flex items-center justify-center gap-px"><span className="text-sky-400">A</span><span className="text-rose-400">B</span><span className="text-emerald-400">C</span></div> },
          { name: 'Numbers 1-10', farsiName: 'اعداد ۱ تا ۱۰', icon: <div className="w-8 h-8 text-2xl font-bold flex items-center justify-center gap-px"><span className="text-indigo-400">1</span><span className="text-teal-400">2</span><span className="text-fuchsia-400">3</span></div> },
          { name: 'Basic Greetings', farsiName: 'احوالپرسی اولیه', icon: <SmileIcon className="w-8 h-8" /> },
          { name: 'Unit 1 Challenge', farsiName: 'آزمون واحد ۱', icon: <TrophyIcon className="w-8 h-8 text-amber-400" /> },
        ]
      },
      {
        name: 'Unit 2: Building Blocks',
        farsiName: 'واحد ۲: بلوک‌های ساختمانی',
        topics: [
          { name: 'Introducing Yourself', farsiName: 'معرفی کردن خود', icon: <UserIcon className="w-8 h-8" /> },
          { name: 'Colors', farsiName: 'رنگ‌ها', icon: <PaletteIcon className="w-8 h-8" /> },
          { name: 'Common Objects', farsiName: 'اشیاء رایج', icon: <ArchiveIcon className="w-8 h-8" /> },
          { name: 'Unit 2 Challenge', farsiName: 'آزمون واحد ۲', icon: <TrophyIcon className="w-8 h-8 text-amber-400" /> },
        ]
      },
      {
        name: 'Unit 3: Everyday Life',
        farsiName: 'واحد ۳: زندگی روزمره',
        topics: [
          { name: 'Family Members', farsiName: 'اعضای خانواده', icon: <UsersIcon className="w-8 h-8" /> },
          { name: 'Basic Foods', farsiName: 'غذاهای اصلی', icon: <AppleIcon className="w-8 h-8" /> },
          { name: 'Days of the Week', farsiName: 'روزهای هفته', icon: <CalendarDaysIcon className="w-8 h-8" /> },
          { name: 'Unit 3 Challenge', farsiName: 'آزمون واحد ۳', icon: <TrophyIcon className="w-8 h-8 text-amber-400" /> },
        ]
      },
      {
        name: 'Unit 4: Simple Sentences',
        farsiName: 'واحد ۴: جملات ساده',
        topics: [
          { name: "The Verb 'To Be'", farsiName: "فعل 'بودن' (am, is, are)", icon: <BeakerIcon className="w-8 h-8" /> },
          { name: "The Verb 'To Have'", farsiName: "فعل 'داشتن' (have, has)", icon: <BeakerIcon className="w-8 h-8" /> },
          { name: 'Simple Questions', farsiName: 'سوالات ساده (What, Where)', icon: <HelpCircleIcon className="w-8 h-8" /> },
          { name: 'Beginner Final Challenge', farsiName: 'آزمون نهایی مبتدی', icon: <TrophyIcon className="w-8 h-8 text-yellow-300" /> },
        ]
      },
    ]
  },
  {
    level: 'Intermediate' as UserLevel,
    description: 'مهارت های مکالمه خود را بسازید.',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    units: [
      {
        name: 'Unit 1: Expanding Your World',
        farsiName: 'واحد ۱: دنیای خود را گسترش دهید',
        topics: [
          { name: 'My Home', farsiName: 'خانه من', icon: <HouseIcon className="w-8 h-8" /> },
          { name: 'Telling Time & Dates', farsiName: 'گفتن زمان و تاریخ', icon: <ClockIcon className="w-8 h-8" /> },
          { name: 'Shopping & Money', farsiName: 'خرید و پول', icon: <ShoppingBagIcon className="w-8 h-8" /> },
          { name: 'Unit 1 Challenge', farsiName: 'آزمون واحد ۱', icon: <TrophyIcon className="w-8 h-8 text-amber-400" /> },
        ]
      },
      {
        name: 'Unit 2: Actions & Activities',
        farsiName: 'واحد ۲: اقدامات و فعالیت‌ها',
        topics: [
          { name: 'Present Continuous', farsiName: 'حال استمراری (ing-)', icon: <BeakerIcon className="w-8 h-8" /> },
          { name: 'Hobbies & Free Time', farsiName: 'سرگرمی‌ها و اوقات فراغت', icon: <HeartIcon className="w-8 h-8" /> },
          { name: 'Simple Past Tense', farsiName: 'زمان گذشته ساده', icon: <HourglassIcon className="w-8 h-8" /> },
          { name: 'Unit 2 Challenge', farsiName: 'آزمون واحد ۲', icon: <TrophyIcon className="w-8 h-8 text-amber-400" /> },
        ]
      },
      {
        name: 'Unit 3: Describing Your World',
        farsiName: 'واحد ۳: توصیف دنیای شما',
        topics: [
          { name: 'Common Adjectives', farsiName: 'صفت‌های رایج', icon: <PaletteIcon className="w-8 h-8" /> },
          { name: 'Talking about the Weather', farsiName: 'صحبت در مورد آب و هوا', icon: <CloudIcon className="w-8 h-8" /> },
          { name: 'Comparatives', farsiName: 'صفت‌های تفضیلی (er, more)', icon: <ScaleIcon className="w-8 h-8" /> },
          { name: 'Unit 3 Challenge', farsiName: 'آزمون واحد ۳', icon: <TrophyIcon className="w-8 h-8 text-amber-400" /> },
        ]
      },
       {
        name: 'Unit 4: Out and About',
        farsiName: 'واحد ۴: بیرون و گشت و گذار',
        topics: [
          { name: 'Asking for Directions', farsiName: 'آدرس پرسیدن', icon: <MapPinIcon className="w-8 h-8" /> },
          { name: 'Ordering at a Restaurant', farsiName: 'سفارش در رستوران', icon: <UtensilsIcon className="w-8 h-8" /> },
          { name: 'Future Tense', farsiName: 'زمان آینده (will, going to)', icon: <HourglassIcon className="w-8 h-8" /> },
          { name: 'Intermediate Final Challenge', farsiName: 'آزمون نهایی متوسط', icon: <TrophyIcon className="w-8 h-8 text-yellow-300" /> },
        ]
      },
    ]
  },
  {
    level: 'Advanced' as UserLevel,
    description: 'در سناریوهای پیچیده استاد شوید.',
    color: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-500/30',
    units: [
        {
            name: 'Advanced Topics (AI Generated)',
            farsiName: 'موضوعات پیشرفته (تولید شده توسط هوش مصنوعی)',
            topics: [
              { name: 'Job Interview Practice', farsiName: 'تمرین مصاحبه شغلی', icon: <BriefcaseIcon className="w-8 h-8" /> },
              { name: 'Discussing Current Events', farsiName: 'بحث درباره اخبار روز', icon: <BookOpenIcon className="w-8 h-8" /> },
              { name: 'Expressing Opinions', farsiName: 'بیان نظرات', icon: <MessageSquareIcon className="w-8 h-8" /> },
              { name: 'Idioms and Slang', farsiName: 'اصطلاحات و عامیانه', icon: <QuoteIcon className="w-8 h-8" /> },
              { name: 'Complex Grammar: Conditionals', farsiName: 'گرامر پیچیده: جملات شرطی', icon: <BrainCircuitIcon className="w-8 h-8" /> },
              { name: 'Complex Grammar: Passive Voice', farsiName: 'گرامر پیچیده: جملات مجهول', icon: <BrainCircuitIcon className="w-8 h-8" /> },
              { name: 'Cultural Differences', farsiName: 'تفاوت های فرهنگی', icon: <GlobeIcon className="w-8 h-8" /> },
            ]
        }
    ]
  },
];

const TopicButton: React.FC<{
    levelName: string;
    topic: { name: string; farsiName: string; icon: JSX.Element };
    onClick: (topic: string, level: string) => void;
    isLocked: boolean;
    isCompleted: boolean;
    isActive: boolean;
}> = ({ levelName, topic, onClick, isLocked, isCompleted, isActive }) => {
    return (
        <button
            onClick={() => !isLocked && onClick(topic.name, levelName)}
            disabled={isLocked}
            className={`w-full max-w-sm mx-auto flex items-center justify-between text-left gap-4 p-3 rounded-xl shadow-md transition-all duration-300 border-2
                ${isLocked 
                ? 'bg-slate-800/40 border-slate-800/60 cursor-not-allowed' 
                : 'bg-slate-800/80 hover:bg-slate-700/90 hover:-translate-y-0.5'
                }
                ${isCompleted && !isLocked ? 'border-teal-500/50 bg-slate-800/60' : 'border-slate-700/80'}
                ${isActive ? 'border-indigo-500/80 shadow-indigo-500/20 shadow-lg animate-pulse' : ''}
            `}
        >
            <div className={`flex items-center justify-center w-14 h-14 rounded-lg flex-shrink-0 text-white ${isLocked ? 'bg-slate-700/50' : isCompleted ? 'bg-slate-700/80' : 'bg-indigo-500'}`}>
                {isLocked ? <LockIcon className="w-7 h-7 text-slate-500" /> : <div className={`${isCompleted ? 'opacity-60' : ''}`}>{topic.icon}</div>}
            </div>
            <div className="flex-grow">
                <h4 className={`font-bold ${isLocked ? 'text-slate-500' : 'text-slate-100'}`} style={{ direction: 'rtl' }}>{topic.farsiName}</h4>
                <p className={`text-sm ${isLocked ? 'text-slate-600' : 'text-slate-400'}`}>{topic.name}</p>
            </div>
            {isCompleted && !isLocked && (
                <div className="flex-shrink-0 pr-2">
                <CheckCircleIcon className="w-8 h-8 text-teal-400" />
                </div>
            )}
        </button>
    )
};

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartLesson, userLevel }) => {
  const { isSoundEnabled, completedLessons } = useUserProgress();
  const userRank = userLevel ? levelRanks[userLevel] : 0; // 0 means nothing unlocked if no level

  const handleLessonClick = (topic: string, level: string) => {
    playButtonClickSound(isSoundEnabled);
    triggerHapticFeedback(isSoundEnabled);
    onStartLesson(topic, level);
  }
  
  const allTopicsInLevelAreComplete = (levelIndex: number): boolean => {
      if (levelIndex === 0) return true; // Beginner level needs no prior completion
      const prevLevel = difficultyLevels[levelIndex - 1];
      const allTopics = prevLevel.units.flatMap(unit => unit.topics);
      return allTopics.every(topic => completedLessons.includes(`${prevLevel.level}-${topic.name}`));
  };

  const getTopicStates = (level: typeof difficultyLevels[0]) => {
    let allTopicStates: {
        topic: { name: string; farsiName: string; icon: JSX.Element };
        isLocked: boolean; isCompleted: boolean; isActive: boolean
    }[] = [];
    
    level.units.forEach(unit => {
        unit.topics.forEach(topic => {
            const lessonId = `${level.level}-${topic.name}`;
            const isCompleted = completedLessons.includes(lessonId);
            allTopicStates.push({ topic, isCompleted, isLocked: false, isActive: false });
        });
    });

    let firstUncompletedFound = false;
    for (let i = 0; i < allTopicStates.length; i++) {
        const isCompleted = allTopicStates[i].isCompleted;

        if (i === 0) {
            allTopicStates[i].isLocked = false;
        } else {
            const prevLessonCompleted = allTopicStates[i - 1].isCompleted;
            allTopicStates[i].isLocked = !prevLessonCompleted;
        }

        if (!isCompleted && !firstUncompletedFound) {
            allTopicStates[i].isActive = true;
            firstUncompletedFound = true;
        }
    }
    
    return allTopicStates;
  };

  return (
    <div className="text-center">
      
      {userLevel && <LevelProgress />}

      <h2 className="text-2xl font-bold mb-2 text-slate-100" style={{ direction: 'rtl' }}>
        {userLevel ? `مسیر یادگیری شما` : 'یک درس را انتخاب کنید'}
      </h2>
      <p className="text-lg mb-8 text-slate-300" style={{ direction: 'rtl' }}>
        برای شروع، یک موضوع را از یک سطح باز انتخاب کنید.
      </p>

      <div className="space-y-8">
        {difficultyLevels.map((level, levelIndex) => {
          const currentRank = levelRanks[level.level as UserLevel];
          const isLevelUnlocked = userLevel && currentRank <= userRank;
          const isNextLevelToUnlock = userLevel && currentRank === levelRanks[userLevel] + 1;
          
          if (!userLevel && levelIndex > 0) return null;
          if (userLevel && currentRank > levelRanks[userLevel] + 1) return null;

          if (!isLevelUnlocked && !isNextLevelToUnlock) {
            return (
              <div key={level.level} className="p-4 md:p-6 rounded-2xl shadow-lg border-2 bg-slate-900/40 backdrop-blur-sm border-slate-800/50 opacity-60">
                <h3 className={`flex items-center justify-center gap-3 text-2xl font-bold text-slate-500`}>
                  <LockIcon className="w-6 h-6" />
                  {level.level}
                </h3>
              </div>
            );
          }
          
          if (isNextLevelToUnlock) {
            const isPrevLevelComplete = allTopicsInLevelAreComplete(levelIndex);

            if (!isPrevLevelComplete) {
              return (
                <div key={level.level} className={`p-4 md:p-6 rounded-2xl shadow-lg border-2 bg-slate-900/60 backdrop-blur-sm ${level.borderColor} opacity-80`}>
                  <h3 className={`flex items-center justify-center gap-3 text-2xl font-bold ${level.color}`}>
                    <LockIcon className="w-6 h-6" />
                    {level.level}
                  </h3>
                  <p className="text-slate-300 my-4" style={{ direction: 'rtl' }}>
                    {`برای باز کردن، تمام دروس سطح قبل را کامل کنید.`}
                  </p>
                </div>
              );
            }
            
             return (
              <div key={level.level} className={`p-4 md:p-6 rounded-2xl shadow-lg border-2 bg-slate-900/60 backdrop-blur-sm ${level.borderColor}`}>
                 <h3 className={`flex items-center justify-center gap-3 text-2xl font-bold ${level.color}`}>
                  <TrophyIcon className="w-6 h-6" />
                  {`آزمون سطح ${level.level}`}
                </h3>
                <p className="text-slate-300 my-4" style={{ direction: 'rtl' }}>{`دانش خود را برای باز کردن سطح ${level.level} آزمایش کنید.`}</p>
                <button
                  onClick={() => handleLessonClick(`${level.level} Final Challenge`, level.level)}
                  className="w-full max-w-xs mx-auto px-6 py-3 rounded-xl text-lg font-bold shadow-md transition-transform hover:scale-105 bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  شروع آزمون
                </button>
              </div>
            );
          }
          
          const allTopicStatesForLevel = getTopicStates(level);

          return (
            <div key={level.level} className={`p-4 md:p-6 rounded-2xl shadow-lg border-2 bg-slate-900/60 backdrop-blur-sm ${level.borderColor}`}>
              <h3 className={`text-2xl font-bold ${level.color}`}>{level.level}</h3>
              <p className="text-slate-300 mb-6" style={{ direction: 'rtl' }}>{level.description}</p>
              
              <div className="space-y-6">
                {level.units.map((unit) => {
                    const unitTopics = allTopicStatesForLevel.filter(s => unit.topics.some(t => t.name === s.topic.name));
                    
                    return (
                        <div key={unit.name}>
                            <h4 className="font-bold text-lg text-slate-400 mb-3" style={{direction: 'rtl'}}>{unit.farsiName}</h4>
                            <div className="flex flex-col items-center gap-2">
                                {unitTopics.map(({topic, isLocked, isCompleted, isActive}, index) => (
                                    <React.Fragment key={topic.name}>
                                        {index > 0 && (
                                            <div className="w-1 h-6 bg-slate-700/50 rounded-full" />
                                        )}
                                        <TopicButton 
                                            levelName={level.level}
                                            topic={topic}
                                            onClick={handleLessonClick}
                                            isLocked={isLocked && !isLevelUnlocked}
                                            isCompleted={isCompleted}
                                            isActive={isActive && isLevelUnlocked}
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeScreen;
