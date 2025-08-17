import { Exercise, ExerciseType } from '../types';
import { pregeneratedPlacementTests } from './pregeneratedData';

// --- In-memory cache for pre-generated lessons ---
let cachedPregeneratedLessons: Record<string, Exercise[][]> | null = null;

/**
 * Fetches pre-generated lessons from a static JSON file.
 * Caches the result in memory to avoid repeated network requests.
 */
async function getPregeneratedLessons(): Promise<Record<string, Exercise[][]>> {
    if (cachedPregeneratedLessons) {
        return cachedPregeneratedLessons;
    }
    try {
        console.log("Fetching pre-generated lessons for the first time...");
        const response = await fetch('/lessons.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch lessons: ${response.statusText}`);
        }
        const lessons = await response.json();
        cachedPregeneratedLessons = lessons;
        console.log("Pre-generated lessons loaded and cached.");
        return lessons;
    } catch (error) {
        console.error("Could not load pregenerated lessons:", error);
        // Return an empty object on failure to prevent the app from crashing.
        // This means pre-generated lessons won't load, but API lessons still can.
        return {};
    }
}


async function callApi<T>(action: string, payload: unknown): Promise<T> {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, payload }),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
            console.error('API Error:', response.status, errorBody);
            throw new Error(errorBody.error || `Request failed with status ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(`Error calling API for action "${action}":`, error);
        // Rethrow a more generic error to be displayed to the user
        throw new Error("A network error occurred. Please check your connection and try again.");
    }
}

// --- Levenshtein distance function for typo detection ---
function levenshteinDistance(s1: string, s2: string): number {
    if (s1.length > s2.length) {
        [s1, s2] = [s2, s1]; // s1 should be the shorter string
    }

    const distances = Array.from({ length: s1.length + 1 }, (_, i) => i);

    for (let j = 0; j < s2.length; j++) {
        let previousDiagonal = distances[0];
        distances[0] = j + 1;
        for (let i = 0; i < s1.length; i++) {
            const temp = distances[i + 1];
            if (s2[j] === s1[i]) {
                distances[i + 1] = previousDiagonal;
            } else {
                distances[i + 1] = Math.min(
                    distances[i],      // deletion from s2
                    distances[i + 1],  // insertion into s2
                    previousDiagonal   // substitution
                ) + 1;
            }
            previousDiagonal = temp;
        }
    }
    return distances[s1.length];
}

// --- Jaro-Winkler similarity function for smarter answer evaluation ---
function jaroWinkler(s1: string, s2: string): number {
    if (s1 === s2) return 1.0;
    if (!s1 || !s2) return 0.0;

    let m = 0;
    const range = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
    const s1Matches = new Array(s1.length).fill(false);
    const s2Matches = new Array(s2.length).fill(false);

    for (let i = 0; i < s1.length; i++) {
        const start = Math.max(0, i - range);
        const end = Math.min(i + range + 1, s2.length);
        for (let j = start; j < end; j++) {
            if (!s2Matches[j] && s1[i] === s2[j]) {
                s1Matches[i] = true;
                s2Matches[j] = true;
                m++;
                break;
            }
        }
    }

    if (m === 0) return 0.0;

    let t = 0;
    let k = 0;
    for (let i = 0; i < s1.length; i++) {
        if (s1Matches[i]) {
            while (!s2Matches[k]) k++;
            if (s1[i] !== s2[k]) t++;
            k++;
        }
    }

    const jaro = (m / s1.length + m / s2.length + (m - t / 2) / m) / 3;

    // Winkler bonus
    let p = 0.1;
    let l = 0;
    const limit = Math.min(4, s1.length, s2.length);
    while (l < limit && s1[l] === s2[l]) l++;
    
    return jaro + l * p * (1 - jaro);
}


export const generateLesson = async (topic: string, level: string): Promise<Exercise[]> => {
  // --- OFFLINE-FIRST FOR BEGINNER & INTERMEDIATE LESSONS ---
  if (level === 'Beginner' || level === 'Intermediate') {
    const allPregeneratedLessons = await getPregeneratedLessons();
    // Create a unique key to prevent conflicts between levels (e.g., "Unit 1 Challenge").
    const lessonKey = `${level}-${topic}`;
    const variations = allPregeneratedLessons[lessonKey];
    if (variations && variations.length > 0) {
      console.log(`Loading pre-generated lesson for topic: "${lessonKey}"`);
      // Randomly select one of the pre-made lesson variations
      const lesson = variations[Math.floor(Math.random() * variations.length)];
      return Promise.resolve(lesson);
    }
  }

  // --- CACHE/API FOR ADVANCED AND FALLBACK ---
  const lessonCacheKey = `lesson-${level}-${topic}`;
  
  // 1. Try to load from localStorage first
  try {
    const cachedLesson = localStorage.getItem(lessonCacheKey);
    if (cachedLesson) {
      console.log(`Loading lesson "${topic}" from cache.`);
      return JSON.parse(cachedLesson);
    }
  } catch (e) {
    console.warn("Could not read lesson from localStorage", e);
  }

  // 2. If not in cache, call API
  try {
    console.log(`Generating lesson "${topic}" via API.`);
    const lessonExercises = await callApi<Exercise[]>('generateLesson', { topic, level });
    
    // 3. Cache the new lesson in localStorage
    try {
      localStorage.setItem(lessonCacheKey, JSON.stringify(lessonExercises));
    } catch (e) {
      console.warn("Could not save lesson to localStorage", e);
    }
    
    return lessonExercises;
  } catch (error) {
    console.error("Error generating lesson:", error);
    throw new Error("Could not generate the lesson. Please try again.");
  }
};

export const generatePlacementTest = async (): Promise<Exercise[]> => {
    console.log("Loading pre-generated placement test...");
    // Select one of the test variations at random
    const testVariation = pregeneratedPlacementTests[Math.floor(Math.random() * pregeneratedPlacementTests.length)];
    return Promise.resolve(testVariation);
};

export const evaluateAnswer = async (userAnswer: string, correctAnswer: string): Promise<boolean> => {
    // Simple client-side checks for instant feedback on exact matches.
    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = correctAnswer.trim().toLowerCase();

    if (normalizedUser === normalizedCorrect) {
        return true;
    }

    // Use Jaro-Winkler for a more "fuzzy" string comparison for potential typos.
    // A threshold of 0.85 is a good starting point for leniency.
    if (jaroWinkler(normalizedUser, normalizedCorrect) > 0.85) {
        return true;
    }

    // Levenshtein distance: if the number of changes is small relative to the string length,
    // it's likely a typo. e.g., max 2 changes for a 10-char string.
    const distance = levenshteinDistance(normalizedUser, normalizedCorrect);
    if (distance <= Math.max(1, Math.floor(normalizedCorrect.length / 5))) {
        return true;
    }
    
    // If simple checks fail, call the API for advanced evaluation.
    try {
        console.log(`Evaluating answer "${userAnswer}" against "${correctAnswer}" via API.`);
        const result = await callApi<{ isCorrect: boolean }>('evaluateAnswer', { userAnswer, correctAnswer });
        return result.isCorrect;
    } catch (error) {
        console.error("API evaluation failed, falling back to strict comparison:", error);
        // Fallback to strict comparison if API fails, to avoid penalizing user for network issues.
        return false;
    }
};