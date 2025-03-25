export interface Question {
    id: number;
    meaning: string;
    correctAnswer: string;
    imageUrl: string;
    options: string[];
  }
  
  export interface QuizResult {
    level: number;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    date: string;
  }
  
  export interface QuizState {
    currentQuestion: number;
    questions: Question[];
    answers: string[];
    isCompleted: boolean;
    level: number;
    score: number;
  }