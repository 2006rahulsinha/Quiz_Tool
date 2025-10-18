import { create } from 'zustand';

interface Question {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
}

interface QuizState {
  topic: string;
  difficulty: string;
  numQuestions: number;
  questions: Question[];
  userAnswers: Record<number, string>;
  score: number;
  isLoading: boolean;
  error: string | null;

  setTopic: (topic: string) => void;
  setDifficulty: (difficulty: string) => void;
  setNumQuestions: (num: number) => void;
  setQuestions: (questions: Question[]) => void;
  setUserAnswer: (questionIndex: number, answer: string) => void;
  setScore: (score: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  topic: '',
  difficulty: 'Medium',
  numQuestions: 5,
  questions: [],
  userAnswers: {},
  score: 0,
  isLoading: false,
  error: null,

  setTopic: (topic) => set({ topic }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setNumQuestions: (num) => set({ numQuestions: num }),
  setQuestions: (questions) => set({ questions }),
  setUserAnswer: (questionIndex, answer) =>
    set((state) => ({
      userAnswers: { ...state.userAnswers, [questionIndex]: answer }
    })),
  setScore: (score) => set({ score }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  resetQuiz: () => set({
    topic: '',
    difficulty: 'Medium',
    numQuestions: 5,
    questions: [],
    userAnswers: {},
    score: 0,
    isLoading: false,
    error: null
  })
}));
