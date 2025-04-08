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
    const newRecord: ScoreHistory = {
      id: crypto.randomUUID(),
      level: level!,
      score: finalScore,
      date: new Date().toISOString(),
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

  const handleViewHistory = () => {
    setShowHistory(true);
  };

  if (showHistory) {
    return <ScoreHistoryView onBack={handleBack} />;
  }

  if (score !== null) {
    return <Results score={score} onRestart={handleRestart} onBack={handleBack} />;
  }

  if (level === null) {
    return <QuizLevelSelector onSelectLevel={handleLevelSelect} onViewHistory={handleViewHistory} />;
  }

  return <Quiz level={level} onComplete={handleQuizComplete} onBack={handleBack} />;
}

export default App;