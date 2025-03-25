import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { QuizResult } from '@/types/quiz';

interface ResultCardProps {
  result: QuizResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { level, score, totalQuestions, correctAnswers, date } = result;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getScoreColor = () => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.secondary;
    return colors.error;
  };
  
  const getLevelText = () => {
    switch (level) {
      case 1: return '1단계 (2지선다)';
      case 2: return '2단계 (4지선다)';
      case 3: return '3단계 (주관식)';
      default: return `${level}단계`;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.levelText}>{getLevelText()}</Text>
        <Text style={[styles.scoreText, { color: getScoreColor() }]}>
          {score}점
        </Text>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.detailText}>
          {correctAnswers} / {totalQuestions} 문제 정답
        </Text>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: colors.textLight,
  },
  dateText: {
    fontSize: 12,
    color: colors.textLight,
  },
});