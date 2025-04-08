import React, { useState } from 'react';
import { QuizLevel, ScoreHistory } from './types';
import { QuizLevelSelector } from './components/QuizLevel';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { ScoreHistoryView } from './components/ScoreHistory';

function App() {
  const [level, setLevel] = useState<QuizLevel | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);

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

  const handleBack = () => {
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
    return <Results score={score} onRestart={handleRestart} />;
  }

  if (level === null) {
    return <QuizLevelSelector onSelectLevel={handleLevelSelect} onViewHistory={handleViewHistory} />;
  }

  return <Quiz level={level} onComplete={handleQuizComplete} onBack={handleBack} />;
}

export default App;