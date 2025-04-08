import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowLeft, History, Star, Award, Crown } from 'lucide-react';
import { QuizLevel } from '../types';

// 히어로 이미지 가져오기
import hero1 from '../image/hero/hero-1.png';
import hero2 from '../image/hero/hero-2.png';
import hero3 from '../image/hero/hero-3.png';

interface QuizLevelSelectorProps {
  onSelectLevel: (level: QuizLevel) => void;
  onViewHistory: () => void;
}

export function QuizLevelSelector({ onSelectLevel, onViewHistory }: QuizLevelSelectorProps) {
  // 히어로 이미지 슬라이드쇼 상태
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [hero1, hero2, hero3];

  // 이미지 자동 슬라이드 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-kid relative overflow-hidden">
      {/* 히어로 이미지 배경 - 투명도 조정 및 효과 추가 */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img 
          src={heroImages[currentImageIndex]} 
          alt="히어로 배경" 
          className="w-full h-full object-cover opacity-40 transition-opacity duration-1000 ease-in-out filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-kid-bg/50 to-kid-bg/80"></div>
      </div>
      
      <div className="w-full max-w-[1280px] mx-auto px-4 relative z-10">
        <div className="text-center mb-8 animate-float">
          <div className="w-24 h-24 bg-kid-yellow rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="w-12 h-12 text-kid-text" />
          </div>
          <h1 className="text-5xl font-bold text-kid-purple mb-2 drop-shadow-md">사자성어 퀴즈</h1>
          <p className="text-2xl text-kid-text drop-shadow-sm"> 풀어보세요!</p>
        </div>
        
        {/* 히어로 이미지 슬라이더 제거하고 메뉴에 집중 */}
        
        <div className="grid gap-6 w-full max-w-md mx-auto backdrop-blur-sm bg-white/20 p-6 rounded-2xl shadow-xl border border-white/30">
          <button
            onClick={() => onSelectLevel(1)}
            className="kid-card p-6 bg-white/90 hover:bg-kid-yellow/10 flex items-center space-x-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-4 border-kid-yellow relative overflow-hidden"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-kid-yellow/20 via-transparent to-transparent"></span>
            <div className="w-16 h-16 rounded-full bg-kid-red flex items-center justify-center shadow-md animate-pulse">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-kid-red mb-1">Level 1</h2>
              <p className="text-kid-text">쉬운 문제 · 2지선다 · 5문제</p>
            </div>
          </button>

          <button
            onClick={() => onSelectLevel(2)}
            className="kid-card p-6 bg-white/90 hover:bg-kid-teal/10 flex items-center space-x-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-4 border-kid-teal relative overflow-hidden"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-kid-teal/20 via-transparent to-transparent"></span>
            <div className="w-16 h-16 rounded-full bg-kid-teal flex items-center justify-center shadow-md animate-pulse">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-kid-teal mb-1">Level 2</h2>
              <p className="text-kid-text">보통 문제 · 4지선다 · 10문제</p>
            </div>
          </button>

          <button
            onClick={() => onSelectLevel(3)}
            className="kid-card p-6 bg-white/90 hover:bg-kid-purple/10 flex items-center space-x-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-4 border-kid-purple relative overflow-hidden"
          >
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-kid-purple/20 via-transparent to-transparent"></span>
            <div className="w-16 h-16 rounded-full bg-kid-purple flex items-center justify-center shadow-md animate-pulse">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-kid-purple mb-1">Level 3</h2>
              <p className="text-kid-text">어려운 문제 · 주관식 · 5문제</p>
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
          <p className="text-kid-text/70 text-sm backdrop-blur-sm bg-white/30 inline-block px-4 py-1 rounded-full">RinPapa 초등 사자성어 퀴즈</p>
        </div>
      </div>
    </div>
  );
}