import React, { useEffect, useState } from 'react';
import { Trophy, Star, Home, Sparkles, ArrowLeft, Coins, RefreshCw } from 'lucide-react';
import { SoundType } from '../types';
import { playSound, playScoreSound } from '../utils/sounds';
import { SoundControl } from './SoundControl';

interface ResultsProps {
  score: number;
  reward: number;
  level: number;
  onRestart: () => void;
  onReplay: (level: number) => void;
  onBack: () => void;
  onViewHistory: () => void;
}

// 동전 컴포넌트
interface CoinProps {
  delay: number;
  size: number;
  left: string;
}

const CoinAnimation = ({ delay, size, left }: CoinProps) => {
  return (
    <div 
      className="absolute top-0 animate-fall" 
      style={{
        left,
        animationDelay: `${delay}s`,
        fontSize: `${size}px`,
        zIndex: 5
      }}
    >
      <Coins className="text-kid-yellow fill-kid-yellow" />
    </div>
  );
};

export function Results({ score, reward, level, onRestart, onReplay, onBack, onViewHistory }: ResultsProps) {
  // 컴포넌트 마운트 시 점수에 따른 사운드 재생
  useEffect(() => {
    // 점수에 따른 사운드 재생
    playScoreSound(score);
  }, [score]);

  // 별 이미지를 동적으로 표시하기 위한 함수
  const renderStars = () => {
    // 점수를 100점 만점 기준으로 별 개수를 계산 (최대 5개)
    const starCount = Math.round((score / 100) * 5);
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-8 h-8 ${i < starCount ? 'text-kid-yellow fill-kid-yellow' : 'text-gray-300'}`} 
      />
    ));
  };

  // 별 표시를 위한 애니메이션 효과
  const starAnimationClasses = [
    'animate-bounce-slow delay-100',
    'animate-bounce-slow delay-300',
    'animate-bounce-slow delay-500',
    'animate-bounce-slow delay-700',
    'animate-bounce-slow delay-900',
  ];

  // 점수에 따른 메시지 설정
  const getMessage = () => {
    if (score >= 90) return '대단해요! 최고의 실력이네요!';
    if (score >= 70) return '정말 잘했어요! 멋진 실력이에요!';
    if (score >= 50) return '좋아요! 열심히 노력했네요!';
    return '다음에는 더 잘할 수 있을 거예요!';
  };

  return (
    <div className="min-h-screen bg-kid-bg confetti-bg flex items-center justify-center font-kid">
      {/* 사운드 컨트롤 */}
      <SoundControl />
      
      <div className="bg-white kid-card p-8 max-w-md w-full mx-4 relative overflow-hidden">
        {/* 배경 장식 요소 */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-kid-yellow/20 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-kid-pink/20 rounded-full"></div>
        
        {/* 트로피 아이콘 */}
        <div className="w-24 h-24 bg-kid-yellow rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-wiggle">
          <Trophy className="w-14 h-14 text-white" />
        </div>
        
        {/* 타이틀 */}
        <h2 className="text-4xl font-bold text-center text-kid-purple mb-4">
          퀴즈 완료!
        </h2>
        
        {/* 결과 메시지 */}
        <p className="text-2xl text-center text-kid-text mb-3">
          {getMessage()}
        </p>
        
        {/* 점수 표시 */}
        <div className="bg-gradient-to-r from-kid-pink/20 to-kid-purple/20 rounded-xl p-4 my-6">
          <p className="text-xl text-center text-kid-text mb-2">
            내 점수는
          </p>
          <p className="text-5xl font-bold text-center text-kid-purple mb-2 flex items-center justify-center gap-2">
            {score}<span className="text-2xl">점</span>
          </p>
        </div>
        
        {/* 용돈 보상 표시 */}
        {reward > 0 && (
          <div className="bg-gradient-to-r from-kid-yellow/20 to-kid-teal/20 rounded-xl p-4 my-6 cursor-pointer hover:from-kid-yellow/30 hover:to-kid-teal/30 transition-colors"
               onClick={onViewHistory}>
            <p className="text-xl text-center text-kid-text mb-2">
              내 용돈은
            </p>
            <p className="text-4xl font-bold text-center text-kid-teal mb-2 flex items-center justify-center gap-2">
              <Coins className="w-8 h-8 text-kid-yellow fill-kid-yellow" />
              {reward}<span className="text-2xl">원</span>
            </p>
            <p className="text-sm text-center text-kid-text/70 mt-1">
              기록 보기에서 용돈 획득
            </p>
          </div>
        )}
        
        {/* 별점 표시 */}
        <div className="flex justify-center gap-2 mb-8">
          {renderStars().map((star, index) => (
            <div key={index} className={starAnimationClasses[index]}>
              {star}
            </div>
          ))}
        </div>
        
        {/* 버튼 영역 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onReplay(level)}
            className="kid-button py-3 bg-kid-green text-white rounded-full hover:bg-kid-green/90 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>다시 시작하기</span>
          </button>
          <button
            onClick={onBack}
            className="kid-button py-3 bg-kid-red/10 text-kid-red rounded-full hover:bg-kid-red/20 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>이전으로 돌아가기</span>
          </button>
        </div>
        
        {/* 반짝이는 장식 요소들 */}
        <div className="absolute top-5 left-5">
          <Sparkles className="w-6 h-6 text-kid-yellow animate-pulse" />
        </div>
        <div className="absolute bottom-5 right-8">
          <Sparkles className="w-6 h-6 text-kid-teal animate-pulse" />
        </div>
      </div>
    </div>
  );
}