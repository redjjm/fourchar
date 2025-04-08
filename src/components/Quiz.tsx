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
    <div className="min-h-screen bg-gradient-to-b from-kid-bg/50 to-kid-bg py-8 font-kid relative overflow-hidden">
      {/* 배경 캐릭터 이미지 */}
      <div className="absolute bottom-0 right-0 w-1/5 h-auto opacity-70 z-0">
        <img src="/image/hero/hero-2.png" alt="캐릭터" className="object-contain" />
      </div>
      
      <div className="w-full max-w-[1280px] mx-auto px-4 relative z-10">
        <div className="kid-card bg-white p-6 rounded-2xl border-4 border-kid-yellow shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="kid-button p-3 bg-kid-red/10 text-kid-red rounded-full hover:bg-kid-red/20 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-kid-purple">
                문제 {state.currentQuestion + 1} / {totalQuestions}
              </h2>
            </div>
            <div className="bg-kid-purple/10 py-2 px-4 rounded-full">
              <span className="text-lg font-semibold text-kid-purple">
                점수: {Math.round(currentScore)}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <img
                src={`/image/saja/${currentQuestion.id}.png`}
                alt="사자성어 이미지"
                className="w-full h-[300px] object-contain mb-4 rounded-xl border-2 border-kid-teal/30 bg-kid-teal/5"
              />
              {/* 장식용 요소 */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-kid-yellow rounded-full flex items-center justify-center shadow-md transform rotate-12">
                <span className="text-lg font-bold text-white">!</span>
              </div>
            </div>
            <div className="text-center my-4">
              <p className="text-xl text-kid-text font-bold mb-2 bg-kid-pink/10 py-2 px-4 rounded-xl inline-block">
                다음 뜻을 가진 사자성어는 무엇일까요?
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-kid-purple/10 to-kid-teal/10 rounded-xl border-2 border-kid-purple/20 shadow-inner">
              <p className="text-lg text-kid-text">
                {currentQuestion.meaning}
              </p>
            </div>
            {level === 3 && (
              <div className="mt-4 mb-2">
                <p className="text-lg font-medium text-kid-teal p-3 bg-kid-teal/10 rounded-xl border-2 border-kid-teal/20 text-center">
                  {hintText || '5초마다 초성이 제공됩니다.'}
                </p>
              </div>
            )}
          </div>

          {level < 3 ? (
            <div className="grid grid-cols-1 gap-4">
              {options.map((option, idx) => {
                let buttonClass = "p-4 text-lg text-left rounded-xl border-3 transition-all duration-300 transform hover:scale-102 ";
                
                if (selectedAnswer) {
                  if (option === currentQuestion.word) {
                    buttonClass += "bg-kid-green/20 border-kid-green text-kid-text ";
                  } else if (option === selectedAnswer && option !== currentQuestion.word) {
                    buttonClass += "bg-kid-red/20 border-kid-red text-kid-text ";
                  } else {
                    buttonClass += "border-gray-200 opacity-50 ";
                  }
                } else {
                  buttonClass += "border-kid-yellow hover:border-kid-purple hover:bg-kid-purple/10 ";
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
                        <span className="text-kid-green text-2xl">✓</span>
                      )}
                      {selectedAnswer && option === selectedAnswer && option !== currentQuestion.word && (
                        <span className="text-kid-red text-2xl">✗</span>
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
                className={`w-full p-4 rounded-xl text-lg transition-all duration-300 outline-none ${
                  isCorrect === null
                    ? 'border-3 border-kid-yellow focus:border-kid-teal focus:ring-2 focus:ring-kid-teal/50 animate-pulse-border'
                    : isCorrect
                    ? 'border-3 border-kid-green bg-kid-green/10'
                    : 'border-3 border-kid-red bg-kid-red/10'
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
              <div className="mt-4">
                <button
                  className="w-full kid-button bg-kid-purple hover:bg-kid-purple/90 text-white py-4 rounded-xl transition-all duration-300 text-lg font-medium transform hover:scale-102 hover:shadow-lg"
                  onClick={() => {
                    if (!selectedAnswer) {
                      handleSubmit(inputValue);
                    }
                  }}
                  disabled={!!selectedAnswer}
                >
                  확인하기
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
    0% { border-color: rgba(255, 209, 102, 0.7); }
    50% { border-color: rgba(255, 209, 102, 1); }
    100% { border-color: rgba(255, 209, 102, 0.7); }
  }
  
  .animate-pulse-border {
    animation: pulse-border 2s infinite;
  }
  
  .transform {
    transition: transform 0.3s ease;
  }
  
  .hover\:scale-102:hover {
    transform: scale(1.02);
  }
`;
document.head.appendChild(styleTag);