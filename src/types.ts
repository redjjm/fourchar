export interface SajaEntry {
  id: string;
  word: string;
  meaning: string;
}

export interface QuizQuestion {
  id: string;
  word: string;
  meaning: string;
  options: string[];
  correctAnswer: string;
  imageUrl: string;
}

export type QuizLevel = 1 | 2 | 3;

export interface QuizState {
  currentQuestion: number;
  score: number;
  answers: string[];
  completed: boolean;
}

export interface ScoreHistory {
  id: string;
  level: QuizLevel;
  score: number;
  date: string;
}