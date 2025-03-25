import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { idioms } from '@/mocks/idioms';
import { Question, QuizResult, QuizState } from '@/types/quiz';

interface QuizStoreState {
  quizState: QuizState;
  quizHistory: QuizResult[];
  initQuiz: (level: number) => void;
  answerQuestion: (answer: string) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

// Helper function to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper function to generate questions based on level
const generateQuestions = (level: number): Question[] => {
  const shuffledIdioms = shuffleArray(idioms);
  const numQuestions = level === 2 ? 25 : 20;
  const numOptions = level === 1 ? 2 : level === 2 ? 4 : 0;
  
  return shuffledIdioms.slice(0, numQuestions).map((idiom, index) => {
    let options: string[] = [];
    
    if (level === 1 || level === 2) {
      // For levels 1 and 2, create multiple choice options
      const otherIdioms = idioms
        .filter(item => item.id !== idiom.id)
        .map(item => item.idiom);
      
      const shuffledOtherIdioms = shuffleArray(otherIdioms);
      options = [idiom.idiom, ...shuffledOtherIdioms.slice(0, numOptions - 1)];
      options = shuffleArray(options);
    }
    
    return {
      id: index + 1,
      meaning: idiom.meaning,
      correctAnswer: idiom.idiom,
      imageUrl: idiom.imageUrl,
      options
    };
  });
};

export const useQuizStore = create<QuizStoreState>()(
  persist(
    (set, get) => ({
      quizState: {
        currentQuestion: 0,
        questions: [],
        answers: [],
        isCompleted: false,
        level: 0,
        score: 0
      },
      quizHistory: [],
      
      initQuiz: (level: number) => {
        const questions = generateQuestions(level);
        set({
          quizState: {
            currentQuestion: 0,
            questions,
            answers: new Array(questions.length).fill(''),
            isCompleted: false,
            level,
            score: 0
          }
        });
      },
      
      answerQuestion: (answer: string) => {
        const { quizState } = get();
        const { currentQuestion, answers, questions } = quizState;
        
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;
        
        set({
          quizState: {
            ...quizState,
            answers: newAnswers
          }
        });
      },
      
      nextQuestion: () => {
        const { quizState, quizHistory } = get();
        const { currentQuestion, questions, answers, level } = quizState;
        
        if (currentQuestion < questions.length - 1) {
          // Move to next question
          set({
            quizState: {
              ...quizState,
              currentQuestion: currentQuestion + 1
            }
          });
        } else {
          // Calculate score
          let correctAnswers = 0;
          questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
              correctAnswers++;
            }
          });
          
          const score = Math.round((correctAnswers / questions.length) * 100);
          
          // Save result
          const result: QuizResult = {
            level,
            score,
            totalQuestions: questions.length,
            correctAnswers,
            date: new Date().toISOString()
          };
          
          set({
            quizState: {
              ...quizState,
              isCompleted: true,
              score
            },
            quizHistory: [result, ...quizHistory]
          });
        }
      },
      
      resetQuiz: () => {
        set({
          quizState: {
            currentQuestion: 0,
            questions: [],
            answers: [],
            isCompleted: false,
            level: 0,
            score: 0
          }
        });
      }
    }),
    {
      name: 'quiz-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        quizHistory: state.quizHistory
      })
    }
  )
);