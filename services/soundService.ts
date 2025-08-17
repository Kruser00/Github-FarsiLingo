// A service to play sound effects and haptics for user actions.

// Pre-create audio elements to reduce delay on first play.
const sounds: { [key: string]: HTMLAudioElement | null } = {
  correct: typeof Audio !== 'undefined' ? new Audio('/sounds/correct.mp3') : null,
  incorrect: typeof Audio !== 'undefined' ? new Audio('/sounds/incorrect.mp3') : null,
  heartLost: typeof Audio !== 'undefined' ? new Audio('/sounds/heart-lost.mp3') : null,
  lessonComplete: typeof Audio !== 'undefined' ? new Audio('/sounds/lesson-complete.mp3') : null,
  click: typeof Audio !== 'undefined' ? new Audio('/sounds/click.mp3') : null,
};

// Set volumes for different sounds
if (sounds.correct) sounds.correct.volume = 0.5;
if (sounds.incorrect) sounds.incorrect.volume = 0.4;
if (sounds.heartLost) sounds.heartLost.volume = 0.6;
if (sounds.lessonComplete) sounds.lessonComplete.volume = 0.7;
if (sounds.click) sounds.click.volume = 0.3;


const playSound = (sound: HTMLAudioElement | null) => {
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => {
            // Autoplay was prevented. This is common and expected.
        });
    }
}

export const playCorrectSound = (isSoundEnabled: boolean) => {
  if (isSoundEnabled) playSound(sounds.correct);
};

export const playIncorrectSound = (isSoundEnabled: boolean) => {
  if (isSoundEnabled) playSound(sounds.incorrect);
};

export const playHeartLostSound = (isSoundEnabled: boolean) => {
  if (isSoundEnabled) playSound(sounds.heartLost);
};

export const playLessonCompleteSound = (isSoundEnabled: boolean) => {
    if (isSoundEnabled) playSound(sounds.lessonComplete);
};

export const playButtonClickSound = (isSoundEnabled: boolean) => {
    if (isSoundEnabled) playSound(sounds.click);
};

/**
 * Triggers a short haptic feedback vibration if the browser supports it.
 * Tied to isSoundEnabled to give users a single control for all feedback.
 * @param {boolean} isSoundEnabled - Whether sounds (and haptics) are globally enabled.
 */
export const triggerHapticFeedback = (isSoundEnabled: boolean) => {
    if (isSoundEnabled && typeof navigator.vibrate === 'function') {
        // A short, 20ms vibration for a "tap" feel.
        navigator.vibrate(20);
    }
};