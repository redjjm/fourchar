import React, { useState, useEffect, useCallback } from 'react';
import { QuizLevel, ScoreHistory } from './types';
import { QuizLevelSelector } from './components/QuizLevel';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { ScoreHistoryView } from './components/ScoreHistory';

function App() {
  const [level, setLevel] = useState<QuizLevel | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);

  // 로딩 화면을 1초 동안 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleBack = useCallback(() => {
    setLevel(null);
    setScore(null);
    setShowHistory(false);
  }, []);

  // 브라우저 뒤로가기 버튼 처리
  useEffect(() => {
    const handlePopState = () => {
      // 메인화면이 아닌 경우에만 handleBack 실행
      if (level !== null || score !== null || showHistory) {
        handleBack();
      } else {
        // 메인화면에서는 뒤로가기 방지 (다시 히스토리 푸시)
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // 히스토리 엔트리 추가 (항상 추가)
    window.history.pushState(null, '', window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [level, score, showHistory, handleBack]);

  const handleLevelSelect = (selectedLevel: QuizLevel) => {
    setLevel(selectedLevel);
    setScore(null);
  };

  const handleQuizComplete = (finalScore: number) => {
    // 용돈 보상 계산
    const questionsCount = level === 1 || level === 3 ? 5 : 10;
    let reward = 0;
    
    switch (level) {
      case 1:
      case 2:
        reward = Math.round(finalScore / (100 / questionsCount)) * 50; // 맞힌 문제 * 50원
        break;
      case 3:
        reward = Math.round(finalScore / 10) * 100; // 맞힌 문제 * 100원
        break;
    }

    const newRecord: ScoreHistory = {
      id: crypto.randomUUID(),
      level: level!,
      score: finalScore,
      date: new Date().toISOString(),
      reward: reward,
      rewardClaimed: false
    };

    // Save to local storage
    const savedHistory = localStorage.getItem('quizHistory');
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    localStorage.setItem('quizHistory', JSON.stringify([newRecord, ...history]));

    setScore(finalScore);
  };

  const handleRestart = () => {
    setLevel(null);
    setScore(null);
    setShowHistory(false);
  };

  const handleReplay = (selectedLevel: QuizLevel) => {
    setLevel(selectedLevel);
    setScore(null);
  };

  const handleViewHistory = () => {
    setShowHistory(true);
  };

  // 로딩 화면 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-kid-bg flex items-center justify-center">
        <div className="text-center animate-bounce">
          <img 
            src="./image/title/rin-circle.png" 
            alt="사자성어 퀴즈" 
            className="mx-auto w-64 h-auto shadow-lg rounded-xl"
            style={{ 
              animation: 'fadeIn 0.5s ease-in',
            }}
          />
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (showHistory) {
    return <ScoreHistoryView onBack={handleBack} />;
  }

  if (score !== null) {
    // 마지막으로 완료한 퀴즈의 정보를 가져옵니다
    const savedHistory = localStorage.getItem('quizHistory');
    const histories = savedHistory ? JSON.parse(savedHistory) : [];
    const latestQuiz = histories.length > 0 ? histories[0] : null;
    const reward = latestQuiz?.reward || 0;
    
    return <Results 
      score={score} 
      reward={reward}
      level={level as number}
      onRestart={handleRestart}
      onReplay={handleReplay}
      onBack={handleBack}
      onViewHistory={handleViewHistory}
    />;
  }

  if (level === null) {
    return <QuizLevelSelector onSelectLevel={handleLevelSelect} onViewHistory={handleViewHistory} />;
  }

  return (
    <Quiz level={level} onComplete={handleQuizComplete} onBack={handleBack} />
  );
}

export default App;