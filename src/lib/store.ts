import { create } from 'zustand';

interface TypingState {
  language: 'English' | 'Hindi';
  startTime: number | null;
  timeLeft: number; // in seconds
  isStarted: boolean;
  isFinished: boolean;
  content: string;
  userInput: string;
  wpm: number;
  accuracy: number;
  errors: number;
  cpm: number;
  
  setLanguage: (lang: 'English' | 'Hindi') => void;
  setContent: (content: string) => void;
  setUserInput: (input: string) => void;
  startTest: () => void;
  finishTest: () => void;
  updateMetrics: () => void;
  tick: () => void;
  reset: () => void;
}

export const useTypingStore = create<TypingState>((set, get) => ({
  language: 'English',
  startTime: null,
  timeLeft: 30 * 60, // 30 minutes
  isStarted: false,
  isFinished: false,
  content: '',
  userInput: '',
  wpm: 0,
  accuracy: 0,
  errors: 0,
  cpm: 0,

  setLanguage: (language) => set({ language }),
  setContent: (content) => set({ 
    content, 
    userInput: '', 
    isStarted: false, 
    isFinished: false, 
    timeLeft: 30 * 60,
    startTime: null,
    wpm: 0,
    accuracy: 0,
    errors: 0,
    cpm: 0
  }),
  
  setUserInput: (userInput) => {
    const state = get();
    
    // Don't allow typing more than content length
    if (userInput.length > state.content.length) return;
    
    if (!state.isStarted && userInput.length > 0) {
      set({ isStarted: true, startTime: Date.now() });
    }
    
    set({ userInput });
    get().updateMetrics();

    // Finish test if content is fully typed
    if (userInput.length === state.content.length && state.content.length > 0) {
      get().finishTest();
    }
  },

  startTest: () => set({ isStarted: true, startTime: Date.now() }),
  
  finishTest: () => set({ isFinished: true, isStarted: false }),

  tick: () => {
    const { timeLeft, isStarted, finishTest } = get();
    if (isStarted && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
      if (timeLeft === 1) {
        finishTest();
      }
    }
  },

  updateMetrics: () => {
    const { content, userInput, startTime } = get();
    if (!startTime) return;

    let errors = 0;
    const typedTill = userInput.length;
    
    for (let i = 0; i < typedTill; i++) {
      if (userInput[i] !== content[i]) {
        errors++;
      }
    }

    const timeElapsedInMinutes = (Date.now() - startTime) / 60000;
    const charCount = typedTill;
    const wordsTyped = charCount / 5;
    
    // Standard WPM formula: (chars / 5) / time - (errors / time)
    const rawWpm = timeElapsedInMinutes > 0 ? (wordsTyped / timeElapsedInMinutes) : 0;
    const netWpm = Math.max(0, Math.round(rawWpm - (errors / timeElapsedInMinutes)));
    
    const cpm = timeElapsedInMinutes > 0 ? Math.round(charCount / timeElapsedInMinutes) : 0;
    const accuracy = charCount > 0 ? Math.round(((charCount - errors) / charCount) * 100) : 100;

    set({ wpm: netWpm, accuracy, errors, cpm });
  },

  reset: () => set({
    userInput: '',
    isStarted: false,
    isFinished: false,
    timeLeft: 30 * 60,
    startTime: null,
    wpm: 0,
    accuracy: 0,
    errors: 0,
    cpm: 0
  })
}));

