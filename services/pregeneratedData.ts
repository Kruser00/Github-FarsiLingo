
import { Exercise, ExerciseType } from '../types';

// This file contains pre-generated content for the app, including placement tests.
// This ensures a fast, reliable, and offline-first experience for core content.
// Lesson data has been moved to /public/lessons.json

// ---- PLACEMENT TESTS ----
// Each inner array is a full test variation. The app will randomly pick one.
export const pregeneratedPlacementTests: Exercise[][] = [
  [ // Test Variation 1
    // Beginner (5 questions)
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'Complete the sentence.', farsiPrompt: 'جمله را کامل کنید.', sentence: 'She ___ a doctor.', options: ['am', 'is', 'are', 'be'], answer: 'is', difficulty: 'Beginner' },
    { type: ExerciseType.TRANSLATE_TO_ENGLISH, prompt: 'Translate to English.', farsiPrompt: 'به انگلیسی ترجمه کنید.', farsiSentence: 'من یک سیب دارم.', answer: 'I have an apple.', difficulty: 'Beginner' },
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'What color is the sky?', farsiPrompt: 'آسمان چه رنگی است؟', options: ['Green', 'Red', 'Yellow', 'Blue'], farsiOptions: ['سبز', 'قرمز', 'زرد', 'آبی'], answer: 'Blue', difficulty: 'Beginner' },
    { type: ExerciseType.FILL_IN_THE_BLANK, prompt: 'Fill in the blank.', farsiPrompt: 'جای خالی را پر کنید.', sentence: 'My name ___ Ali.', answer: 'is', difficulty: 'Beginner' },
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'What comes after Monday?', farsiPrompt: 'چه روزی بعد از دوشنبه است؟', options: ['Tuesday', 'Sunday', 'Friday', 'Wednesday'], farsiOptions: ['سه‌شنبه', 'یکشنبه', 'جمعه', 'چهارشنبه'], answer: 'Tuesday', difficulty: 'Beginner' },
    
    // Intermediate (5 questions)
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'Complete the sentence.', farsiPrompt: 'جمله را کامل کنید.', sentence: 'I ___ to the cinema yesterday.', options: ['go', 'goes', 'went', 'gone'], answer: 'went', difficulty: 'Intermediate' },
    { type: ExerciseType.TRANSLATE_TO_ENGLISH, prompt: 'Translate to English.', farsiPrompt: 'به انگلیسی ترجمه کنید.', farsiSentence: 'ببخشید، نزدیکترین ایستگاه قطار کجاست؟', answer: 'Excuse me, where is the nearest train station?', difficulty: 'Intermediate' },
    { type: ExerciseType.FILL_IN_THE_BLANK, prompt: 'Fill in the blank.', farsiPrompt: 'جای خالی را پر کنید.', sentence: 'This book is more ___ than the last one.', answer: 'interesting', difficulty: 'Intermediate' },
    { type: ExerciseType.TRANSLATE_TO_ENGLISH, prompt: 'Translate to English.', farsiPrompt: 'به انگلیسی ترجمه کنید.', farsiSentence: 'من قصد دارم امشب یک فیلم تماشا کنم.', answer: 'I am going to watch a movie tonight.', difficulty: 'Intermediate' },
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'Which sentence is a polite request?', farsiPrompt: 'کدام جمله یک درخواست مودبانه است؟', options: ['Open the window.', 'I want the window open.', 'Can you open the window?', 'Could you please open the window?'], farsiOptions: ['پنجره را باز کن.', 'من پنجره باز می‌خواهم.', 'می‌توانی پنجره را باز کنی؟', 'ممکن است لطفاً پنجره را باز کنید؟'], answer: 'Could you please open the window?', difficulty: 'Intermediate' },
    
    // Advanced (5 questions)
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'Complete the sentence.', farsiPrompt: 'جمله را کامل کنید.', sentence: 'If I ___ known you were coming, I would have baked a cake.', options: ['have', 'had', 'would', 'did'], answer: 'had', difficulty: 'Advanced' },
    { type: ExerciseType.TRANSLATE_TO_ENGLISH, prompt: 'Translate to English.', farsiPrompt: 'به انگلیسی ترجمه کنید.', farsiSentence: 'علیرغم آب و هوای بد، ما از پیاده‌روی خود لذت بردیم.', answer: 'Despite the bad weather, we enjoyed our walk.', difficulty: 'Advanced' },
    { type: ExerciseType.FILL_IN_THE_BLANK, prompt: 'Fill in the blank.', farsiPrompt: 'جای خالی را پر کنید.', sentence: 'The new policy was ___ by the government to improve public health.', answer: 'implemented', difficulty: 'Advanced' },
    { type: ExerciseType.TRANSLATE_TO_ENGLISH, prompt: 'Translate to English.', farsiPrompt: 'به انگلیسی ترجمه کنید.', farsiSentence: 'دولت ابتکار جدیدی را برای بهبود بهداشت عمومی اجرا کرده است.', answer: 'The government has implemented a new initiative to improve public health.', difficulty: 'Advanced' },
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'Choose the correct idiom. He revealed the secret, he ___.', farsiPrompt: 'اصطلاح صحیح را انتخاب کنید. او راز را فاش کرد، او ___', options: ['hit the books', 'let the cat out of the bag', 'broke a leg', 'hit the nail on the head'], answer: 'let the cat out of the bag', difficulty: 'Advanced' },
  ],
  [ // Test Variation 2
    // Beginner (5 questions)
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'Complete the sentence.', farsiPrompt: 'جمله را کامل کنید.', sentence: 'My name ___ Ali.', options: ['am', 'are', 'is', 'be'], answer: 'is', difficulty: 'Beginner' },
    { type: ExerciseType.TRANSLATE_TO_ENGLISH, prompt: 'Translate to English.', farsiPrompt: 'به انگلیسی ترجمه کنید.', farsiSentence: 'حالت چطوره؟', answer: 'How are you?', difficulty: 'Beginner' },
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'What color is a banana?', farsiPrompt: 'موز چه رنگی است؟', options: ['Red', 'Yellow', 'Blue', 'Black'], farsiOptions: ['قرمز', 'زرد', 'آبی', 'سیاه'], answer: 'Yellow', difficulty: 'Beginner' },
    { type: ExerciseType.FILL_IN_THE_BLANK, prompt: 'Fill in the blank.', farsiPrompt: 'جای خالی را پر کنید.', sentence: 'I have ___ apple.', answer: 'an', difficulty: 'Beginner' },
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'What number is "two"?', farsiPrompt: 'عدد "two" کدام است؟', options: ['1', '2', '3', '4'], answer: '2', difficulty: 'Beginner' },

    // Intermediate (5 questions)
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'Complete the sentence.', farsiPrompt: 'جمله را کامل کنید.', sentence: 'She ___ to music right now.', options: ['listens', 'is listening', 'listened', 'has listened'], answer: 'is listening', difficulty: 'Intermediate' },
    { type: ExerciseType.TRANSLATE_TO_ENGLISH, prompt: 'Translate to English.', farsiPrompt: 'به انگلیسی ترجمه کنید.', farsiSentence: 'میتوانم صورتحساب را داشته باشم لطفا؟', answer: 'Can I have the bill, please?', difficulty: 'Intermediate' },
    { type: ExerciseType.FILL_IN_THE_BLANK, prompt: 'Fill in the blank.', farsiPrompt: 'جای خالی را پر کنید.', sentence: 'A car is faster ___ a bicycle.', answer: 'than', difficulty: 'Intermediate' },
    { type: ExerciseType.TRANSLATE_TO_ENGLISH, prompt: 'Translate to English.', farsiPrompt: 'به انگلیسی ترجمه کنید.', farsiSentence: 'من قصد دارم فردا دوستم را ملاقات کنم.', answer: "I'm going to visit my friend tomorrow.", difficulty: 'Intermediate' },
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'Which of these is a common hobby?', farsiPrompt: 'کدام یک از این‌ها یک سرگرمی رایج است؟', options: ['Working', 'Reading', 'Sleeping', 'Eating'], farsiOptions: ['کار کردن', 'مطالعه', 'خوابیدن', 'خوردن'], answer: 'Reading', difficulty: 'Intermediate' },
    
    // Advanced (5 questions)
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'Complete the sentence.', farsiPrompt: 'جمله را کامل کنید.', sentence: 'The movie, ___ I saw last night, was excellent.', options: ['who', 'that', 'which', 'whose'], answer: 'which', difficulty: 'Advanced' },
    { type: ExerciseType.TRANSLATE_TO_ENGLISH, prompt: 'Translate to English.', farsiPrompt: 'به انگلیسی ترجمه کنید.', farsiSentence: 'سود شرکت امسال به طور قابل توجهی افزایش یافته است.', answer: "The company's profits have increased significantly this year.", difficulty: 'Advanced' },
    { type: ExerciseType.FILL_IN_THE_BLANK, prompt: 'Fill in the blank.', farsiPrompt: 'جای خالی را پر کنید.', sentence: 'The word "ephemeral" means lasting for a very ___ time.', answer: 'short', difficulty: 'Advanced' },
    { type: ExerciseType.TRANSLATE_TO_ENGLISH, prompt: 'Translate to English.', farsiPrompt: 'به انگلیسی ترجمه کنید.', farsiSentence: 'به او توصیه شد که از غذاهای ناسالم پرهیز کند.', answer: 'He was advised to abstain from junk food.', difficulty: 'Advanced' },
    { type: ExerciseType.MULTIPLE_CHOICE, prompt: 'What does the idiom "bite the bullet" mean?', farsiPrompt: 'اصطلاح "bite the bullet" به چه معناست؟', options: ['eat something quickly', 'get angry', 'to endure a difficult situation', 'to make a mistake'], answer: 'to endure a difficult situation', difficulty: 'Advanced' },
  ]
];
