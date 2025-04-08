import React from 'react';
import { BookOpen, ArrowLeft, History } from 'lucide-react';
import { QuizLevel } from '../types';

interface QuizLevelSelectorProps {
  onSelectLevel: (level: QuizLevel) => void;
  onViewHistory: () => void;
}

export function QuizLevelSelector({ onSelectLevel, onViewHistory }: QuizLevelSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="w-full max-w-[1280px] mx-auto px-4">
        <div className="text-center mb-8">
          <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">사자성어 퀴즈</h1>
          <p className="text-gray-600">난이도를 선택하세요</p>
        </div>
        
        <div className="grid gap-4 w-full max-w-md mx-auto">
          <button
            onClick={() => onSelectLevel(1)}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-100 hover:border-blue-300"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Level 1</h2>
            <p className="text-gray-600">2지선다 · 20문제</p>
          </button>

          <button
            onClick={() => onSelectLevel(2)}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-100 hover:border-blue-300"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Level 2</h2>
            <p className="text-gray-600">4지선다 · 25문제</p>
          </button>

          <button
            onClick={() => onSelectLevel(3)}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-100 hover:border-blue-300"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">Level 3</h2>
            <p className="text-gray-600">주관식 · 20문제</p>
          </button>

          <button
            onClick={onViewHistory}
            className="p-4 mt-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition-all border border-gray-200 hover:border-gray-300 flex items-center justify-center gap-2"
          >
            <History className="w-5 h-5" />
            <span>기록 보기</span>
          </button>
        </div>
      </div>
    </div>
  );
}