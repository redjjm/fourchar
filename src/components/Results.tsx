import React from 'react';
import { Trophy } from 'lucide-react';

interface ResultsProps {
  score: number;
  onRestart: () => void;
}

export function Results({ score, onRestart }: ResultsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          퀴즈 완료!
        </h2>
        <p className="text-2xl text-center text-gray-600 mb-6">
          당신의 점수는 <span className="font-bold text-blue-600">{score}</span>점 입니다
        </p>
        <button
          onClick={onRestart}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 시작하기
        </button>
      </div>
    </div>
  );
}