import React from 'react';
import { BookOpen, ArrowLeft, History, Star, Award, Crown } from 'lucide-react';
import { QuizLevel } from '../types';

interface QuizLevelSelectorProps {
  onSelectLevel: (level: QuizLevel) => void;
  onViewHistory: () => void;
}

export function QuizLevelSelector({ onSelectLevel, onViewHistory }: QuizLevelSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-kid-bg confetti-bg font-kid relative overflow-hidden">
      {/* 캐릭터 이미지 배경 */}
      <div className="absolute -left-8 bottom-0 w-1/4 h-auto z-0 opacity-85">
        <img src="/image/hero/hero-1.png" alt="캐릭터 1" className="object-contain" />
      </div>
      <div className="absolute -right-8 bottom-0 w-1/4 h-auto z-0 opacity-85">
        <img src="/image/hero/hero-3.png" alt="캐릭터 3" className="object-contain" />
      </div>
      <div className="absolute top-0 right-1/4 w-1/5 h-auto z-0 opacity-70">
        <img src="/image/hero/hero-2.png" alt="캐릭터 2" className="object-contain" />
      </div>
      
      <div className="w-full max-w-[1280px] mx-auto px-4 relative z-10">
        <div className="text-center mb-8 animate-float">
          <div className="w-24 h-24 bg-kid-yellow rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="w-12 h-12 text-kid-text" />
          </div>
          <h1 className="text-5xl font-bold text-kid-purple mb-2">사자성어 퀴즈</h1>
          <p className="text-2xl text-kid-text"> 풀어보세요!</p>
        </div>
        
        <div className="grid gap-6 w-full max-w-md mx-auto">
          <button
            onClick={() => onSelectLevel(1)}
            className="kid-card p-6 bg-white hover:bg-kid-yellow/10 flex items-center space-x-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-4 border-kid-yellow relative overflow-hidden"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-kid-yellow/20 via-transparent to-transparent"></span>
            <div className="w-16 h-16 rounded-full bg-kid-red flex items-center justify-center shadow-md animate-pulse">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-kid-red mb-1">Level 1</h2>
              <p className="text-kid-text">쉬운 문제 · 2지선다 · 20문제</p>
            </div>
          </button>

          <button
            onClick={() => onSelectLevel(2)}
            className="kid-card p-6 bg-white hover:bg-kid-teal/10 flex items-center space-x-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-4 border-kid-teal relative overflow-hidden"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-kid-teal/20 via-transparent to-transparent"></span>
            <div className="w-16 h-16 rounded-full bg-kid-teal flex items-center justify-center shadow-md animate-pulse">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-kid-teal mb-1">Level 2</h2>
              <p className="text-kid-text">보통 문제 · 4지선다 · 20문제</p>
            </div>
          </button>

          <button
            onClick={() => onSelectLevel(3)}
            className="kid-card p-6 bg-white hover:bg-kid-purple/10 flex items-center space-x-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-4 border-kid-purple relative overflow-hidden"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-kid-purple/20 via-transparent to-transparent"></span>
            <div className="w-16 h-16 rounded-full bg-kid-purple flex items-center justify-center shadow-md animate-pulse">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-kid-purple mb-1">Level 3</h2>
              <p className="text-kid-text">어려운 문제 · 주관식 · 10문제</p>
            </div>
          </button>

          <button
            onClick={onViewHistory}
            className="kid-button mt-6 p-4 bg-kid-green text-white rounded-full flex items-center justify-center gap-2 mx-auto w-48 transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <History className="w-5 h-5" />
            <span className="text-lg">기록 보기</span>
          </button>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-kid-text/70 text-sm">RinPapa 초등 사자성어 퀴즈</p>
        </div>
      </div>
    </div>
  );
}