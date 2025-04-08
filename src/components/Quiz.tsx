import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { QuizLevel, QuizState, SajaEntry } from '../types';
import sajaData from '../data/saja.json';

interface QuizProps {
  level: QuizLevel;
  onComplete: (score: number) => void;
  onBack: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateOptions(correctWord: string, allWords: string[], count: number): string[] {
  const otherWords = allWords.filter(w => w !== correctWord);
  const shuffledOtherWords = shuffleArray(otherWords);
  const wrongOptions = shuffledOtherWords.slice(0, count - 1);
  return shuffleArray([correctWord, ...wrongOptions]);
}

// 초성 추출 함수
function getInitialConsonant(char: string): string {
  const consonants = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
  ];
  
  const code = char.charCodeAt(0);
  
  // 한글 범위 체크 (가 ~ 힣)
  if (code >= 44032 && code <= 55203) {
    const consonantIndex = Math.floor((code - 44032) / 588);
    return consonants[consonantIndex];
  }
  
  return char; // 한글이 아닌 경우 그대로 반환
}

export function Quiz({ level, onComplete, onBack }: QuizProps) {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    answers: [],
    completed: false
  });

  const [questions, setQuestions] = useState<SajaEntry[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hintIndex, setHintIndex] = useState<number>(0);
  const [hintText, setHintText] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [hintPenalty, setHintPenalty] = useState<number>(0); // 힌트 패널티 추적용
  const [currentScore, setCurrentScore] = useState<number>(0); // 실제 획득한 점수만 표시

  const totalQuestions = level === 1 || level === 2 ? 20 : 10;
  const optionsCount = level === 1 ? 2 : level === 2 ? 4 : 0;
  const pointsPerQuestion = level === 3 ? 10 : 100 / totalQuestions; // Level 3은 각 문제당 10점

  useEffect(() => {
    const shuffledData = shuffleArray(sajaData);
    const selectedQuestions = shuffledData.slice(0, totalQuestions);
    
    // JSON 데이터에서 SajaEntry 타입으로 매핑
    const mappedQuestions = selectedQuestions.map(item => ({
      id: String(item.id),
      word: item.idiom,
      meaning: item.meaning
    }));
    
    setQuestions(mappedQuestions);

    if (level < 3) {
      const allWords = sajaData.map(item => item.idiom);
      const currentOptions = generateOptions(
        mappedQuestions[0].word,
        allWords,
        optionsCount
      );
      setOptions(currentOptions);
    }
    
    // 힌트 초기화
    setHintIndex(0);
    setHintText('');
  }, [level]);
  
  // level 3일 때 힌트 타이머
  useEffect(() => {
    if (level !== 3 || !questions.length || selectedAnswer) return;
    
    const currentWord = questions[state.currentQuestion].word;
    
    const hintTimer = setInterval(() => {
      setHintIndex(prevIndex => {
        if (prevIndex < currentWord.length * 2) {
          // 힌트 패널티 최대치(8개)까지만 적용
          if (prevIndex < 8) {
            // 초성 단계: 하나씩 보여주기
            if (prevIndex < currentWord.length) {
              const initialConsonants = [...currentWord].map((char, idx) => {
                if (idx < prevIndex) {
                  return getInitialConsonant(char);
                } else {
                  return '　'; // 공백 문자
                }
              }).join('');
              setHintText('힌트(초성) : ' + initialConsonants);
              
              // 힌트 패널티 증가만 하고 점수 차감은 안 함
              setHintPenalty(prev => Math.min(8, prev + 1));
            } 
            // 글자 하나씩 공개 단계
            else {
              const charIndex = prevIndex - currentWord.length;
              const revealed = [...currentWord].slice(0, charIndex).join('');
              const remaining = [...currentWord].slice(charIndex).map(getInitialConsonant).join('');
              setHintText('힌트(글자) : ' + revealed + remaining);
              
              // 힌트 패널티 증가만 하고 점수 차감은 안 함
              setHintPenalty(prev => Math.min(8, prev + 1));
            }
          }
          
          return prevIndex + 1;
        }
        return prevIndex;
      });
    }, 5000);
    
    return () => clearInterval(hintTimer);
  }, [level, questions, state.currentQuestion, selectedAnswer]);
  
  // 문제 변경 시 힌트 초기화
  useEffect(() => {
    setHintIndex(0);
    setHintPenalty(0); // 힌트 패널티 초기화
    // 힌트 영역은 기본적으로 보이되, 초기에는 빈 초성으로 시작
    if (level === 3 && questions.length > 0) {
      setHintText('');
    }
    // 입력값 초기화
    setInputValue('');
  }, [state.currentQuestion, level, questions]);

  const handleAnswer = async (answer: string) => {
    const currentQuestion = questions[state.currentQuestion];
    const correct = answer === currentQuestion.word;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, correct ? 1000 : 3000));

    const newScore = correct ? state.score + pointsPerQuestion : state.score;
    const newAnswers = [...state.answers, answer];

    if (state.currentQuestion + 1 >= totalQuestions) {
      onComplete(Math.round(newScore));
    } else {
      const allWords = sajaData.map(item => item.idiom);
      const nextOptions = generateOptions(
        questions[state.currentQuestion + 1].word,
        allWords,
        optionsCount
      );
      setOptions(nextOptions);
      setState({
        currentQuestion: state.currentQuestion + 1,
        score: newScore,
        answers: newAnswers,
        completed: false
      });
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const handleSubmit = async (answer: string) => {
    const currentQuestion = questions[state.currentQuestion];
    const correct = answer.trim() === currentQuestion.word;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    // 틀린 경우 힌트를 정답으로 변경
    if (!correct) {
      setHintText(`정답: ${currentQuestion.word}`);
    }

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, correct ? 1000 : 3000));

    // 정답이면 점수 추가
    if (correct) {
      setCurrentScore(prev => prev + pointsPerQuestion); // 획득한 점수 갱신
    }
    
    const newAnswers = [...state.answers, answer];

    if (state.currentQuestion + 1 >= totalQuestions) {
      onComplete(Math.round(currentScore + (correct ? pointsPerQuestion : 0))); // 최종 점수 전달
    } else {
      setState({
        currentQuestion: state.currentQuestion + 1,
        score: state.score + (correct ? pointsPerQuestion : 0), // 내부 점수 상태 유지 (기존 방식)
        answers: newAnswers,
        completed: false
      });
      setSelectedAnswer(null);
      setIsCorrect(null);
      setInputValue(''); // 다음 문제로 넘어갈 때 입력값 초기화
      setHintPenalty(0); // 새 문제에서 힌트 패널티 초기화
    }
  };

  if (!questions.length) return null;

  const currentQuestion = questions[state.currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
      <div className="w-full max-w-[1280px] mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                문제 {state.currentQuestion + 1} / {totalQuestions}
              </h2>
            </div>
            <span className="text-lg font-semibold text-blue-600">
              점수: {Math.round(currentScore)}
            </span>
          </div>

          <div className="mb-6">
            <img
              src={`/images/${currentQuestion.id}.png`}
              alt="사자성어 이미지"
              className="w-full h-[360px] object-contain mb-4"
            />
            <p className="text-xl text-gray-700 mb-4">
              다음 뜻을 가진 사자성어는 무엇일까요?
            </p>
            <p className="text-lg text-gray-600 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              {currentQuestion.meaning}
            </p>
            {level === 3 && (
              <p className="text-lg font-medium text-blue-600 mt-2 mb-4 p-2 bg-blue-50 rounded-lg">
                {hintText || '5초마다 초성이 제공됩니다.'}
              </p>
            )}
          </div>

          {level < 3 ? (
            <div className="grid grid-cols-1 gap-3">
              {options.map((option, idx) => {
                let buttonClass = "p-4 text-left rounded-lg border transition-colors ";
                
                if (selectedAnswer) {
                  if (option === currentQuestion.word) {
                    buttonClass += "bg-green-100 border-green-500 text-green-700 ";
                  } else if (option === selectedAnswer && option !== currentQuestion.word) {
                    buttonClass += "bg-red-100 border-red-500 text-red-700 ";
                  } else {
                    buttonClass += "border-gray-200 opacity-50 ";
                  }
                } else {
                  buttonClass += "border-gray-200 hover:border-blue-500 hover:bg-blue-50 ";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !selectedAnswer && handleAnswer(option)}
                    className={buttonClass}
                    disabled={!!selectedAnswer}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {selectedAnswer && option === currentQuestion.word && (
                        <span className="text-green-600">✓</span>
                      )}
                      {selectedAnswer && option === selectedAnswer && option !== currentQuestion.word && (
                        <span className="text-red-600">✗</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-4">
              <input
                type="text"
                placeholder="사자성어를 입력하세요"
                className={`w-full p-3 rounded-lg transition-colors outline-none ${
                  isCorrect === null
                    ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 animate-pulse-border'
                    : isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !selectedAnswer) {
                    handleSubmit(e.currentTarget.value);
                  }
                }}
                disabled={!!selectedAnswer}
                id="answer-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
              <div className="mt-3">
                <button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors text-lg font-medium"
                  onClick={() => {
                    if (!selectedAnswer) {
                      handleSubmit(inputValue);
                    }
                  }}
                  disabled={!!selectedAnswer}
                >
                  Enter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 스타일 추가 (컴포넌트 밖에 추가)
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes pulse-border {
    0% { border-color: rgba(59, 130, 246, 0.5); }
    50% { border-color: rgba(59, 130, 246, 1); }
    100% { border-color: rgba(59, 130, 246, 0.5); }
  }
  
  .animate-pulse-border {
    animation: pulse-border 2s infinite;
  }
`;
document.head.appendChild(styleTag);