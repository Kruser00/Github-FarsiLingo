


export enum ExerciseType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRANSLATE_TO_ENGLISH = 'TRANSLATE_TO_ENGLISH',
  LEARN = 'LEARN',
  TRANSLATE_TO_FARSI = 'TRANSLATE_TO_FARSI',
  FILL_IN_THE_BLANK = 'FILL_IN_THE_BLANK',
  ALPHABET_PRACTICE = 'ALPHABET_PRACTICE',
}

export type UserLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
  type: ExerciseType;
  prompt: string;
  farsiPrompt?: string;
  options?: string[];
  farsiOptions?: string[]; // Farsi translations for the options
  answer: string;
  farsiSentence?: string;
  sentence?: string; // The sentence with a blank, e.g., "She ___ to the store."
  farsiSentenceExample?: string; // The farsi translation of the example sentence for LEARN type
  difficulty?: UserLevel;
  exampleWord?: string;
  iconName?: string;
}

export type AppView = 'START' | 'HOME' | 'LESSON' | 'LESSON_COMPLETE' | 'PLACEMENT_TEST' | 'PLACEMENT_TEST_COMPLETE' | 'CHOOSE_LEVEL';
export type AnswerStatus = 'UNANSWERED' | 'CORRECT' | 'INCORRECT';

export interface UserProgress {
    xp: number;
    level: number;
    hearts: number;
    lastHeartRefillTimestamp: number; // UTC timestamp ms
    lastAdRewardTimestamp: number; // UTC timestamp ms
    userLevel: UserLevel | null;
    isSoundEnabled: boolean;
    completedLessons: string[];
}