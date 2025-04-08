import React from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { ScoreHistory } from '../types';

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

  const getLevelText = (level: number) => {
    switch (level) {
      case 1: return '2지선다';
      case 2: return '4지선다';
      case 3: return '주관식';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
      <div className="w-full max-w-[1280px] mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">퀴즈 기록</h2>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">아직 퀴즈 기록이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        Level {record.level} ({getLevelText(record.level)})
                      </p>
                      <p className="text-sm text-gray-600">{formatDate(record.date)}</p>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {record.score}점
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}