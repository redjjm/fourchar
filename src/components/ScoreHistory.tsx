import React from 'react';
import { ArrowLeft, Trophy, Star, Clock, Calendar, Award, BarChart } from 'lucide-react';
import { QuizLevel, ScoreHistory } from '../types';

interface ScoreHistoryViewProps {
  onBack: () => void;
}

export function ScoreHistoryView({ onBack }: ScoreHistoryViewProps) {
  const [history, setHistory] = React.useState<ScoreHistory[]>([]);

  React.useEffect(() => {
    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLevelText = (level: QuizLevel) => {
    switch (level) {
      case 1: return '쉬움 (2지선다)';
      case 2: return '보통 (4지선다)';
      case 3: return '어려움 (주관식)';
      default: return '';
    }
  };

  const getLevelColor = (level: QuizLevel) => {
    switch (level) {
      case 1: return 'bg-kid-red text-white';
      case 2: return 'bg-kid-teal text-white';
      case 3: return 'bg-kid-purple text-white';
      default: return 'bg-gray-200';
    }
  };

  const getLevelIcon = (level: QuizLevel) => {
    switch (level) {
      case 1: return <Star className="w-4 h-4" />;
      case 2: return <Award className="w-4 h-4" />;
      case 3: return <BarChart className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-kid-bg confetti-bg py-8 font-kid">
      <div className="w-full max-w-[1280px] mx-auto px-4">
        <div className="bg-white kid-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-kid-yellow/20 transition-colors kid-button"
            >
              <ArrowLeft className="w-6 h-6 text-kid-text" />
            </button>
            <h2 className="text-3xl font-bold text-kid-purple">퀴즈 기록</h2>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-kid-yellow/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-kid-yellow" />
              </div>
              <p className="text-lg text-kid-text">아직 퀴즈 기록이 없습니다.</p>
              <p className="text-kid-text/70 mt-2">첫 번째 퀴즈를 풀어보세요!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="p-4 bg-white rounded-xl border-2 border-kid-pink/30 hover:border-kid-pink transition-colors relative overflow-hidden"
                >
                  {/* 배경 장식 */}
                  <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-kid-yellow/10 z-0"></div>
                  
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(record.level)} flex items-center gap-1`}>
                          {getLevelIcon(record.level)}
                          <span>레벨 {record.level}</span>
                        </span>
                        <span className="text-kid-text/60 text-sm">{getLevelText(record.level)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-kid-text/80">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(record.date)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-kid-purple/10 px-4 py-2 rounded-full">
                      <div className="text-xl font-bold text-kid-purple flex items-center gap-1">
                        <Trophy className="w-5 h-5" />
                        <span>{record.score}점</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 p-4 bg-kid-teal/10 rounded-xl">
            <h3 className="text-xl font-bold text-kid-teal mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>최근 기록</span>
            </h3>
            <p className="text-kid-text">
              {history.length > 0
                ? `지금까지 총 ${history.length}번의 퀴즈를 풀었어요!`
                : '아직 기록이 없어요. 첫 번째 퀴즈를 시작해 보세요!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}