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
  reward?: number;
  rewardClaimed?: boolean;
}

// 사운드 타입 정의
export enum SoundType {
  CORRECT = 'correct',
  WRONG = 'wrong',
  SCORE_20 = 'score-20',
  SCORE_40 = 'score-40',
  SCORE_80 = 'score-80',
  SCORE_100 = 'score-100',
  COLLECT_COIN = 'collect-coin',
  BG_1 = 'bg-1'
}

// 사운드 설정 타입
export interface SoundSettings {
  bgSound: boolean;
  effectSound: boolean;
}