import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuizStore } from '@/store/quiz-store';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { Award, Home, RotateCcw } from 'lucide-react-native';

export default function ResultsScreen() {
  const router = useRouter();
  const { quizState, resetQuiz, initQuiz } = useQuizStore();
  const { score, level } = quizState;
  
  const handleRetryQuiz = () => {
    initQuiz(level);
    router.replace(`/quiz/${level}`);
  };
  
  const handleGoHome = () => {
    resetQuiz();
    router.replace('/');
  };
  
  const getScoreMessage = () => {
    if (score >= 90) return '축하합니다! 완벽에 가까운 점수입니다!';
    if (score >= 80) return '훌륭합니다! 사자성어에 대한 지식이 뛰어납니다.';
    if (score >= 70) return '좋은 성적입니다! 조금만 더 노력하면 완벽해질 거예요.';
    if (score >= 60) return '괜찮은 성적입니다. 더 공부하면 더 좋아질 거예요.';
    if (score >= 50) return '절반 이상 맞추셨네요. 조금 더 노력해보세요.';
    return '아직 더 공부가 필요합니다. 다시 도전해보세요!';
  };
  
  const getScoreImage = () => {
    if (score >= 80) {
      return 'https://images.unsplash.com/photo-1567016526105-22da7c13161a?q=80&w=300&auto=format&fit=crop';
    } else if (score >= 60) {
      return 'https://images.unsplash.com/photo-1579208030886-b937da0925dc?q=80&w=300&auto=format&fit=crop';
    } else {
      return 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=300&auto=format&fit=crop';
    }
  };
  
  const getScoreColor = () => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.secondary;
    return colors.error;
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>퀴즈 결과</Text>
          
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreText, { color: getScoreColor() }]}>
                {score}
              </Text>
              <Text style={styles.scoreLabel}>점</Text>
            </View>
          </View>
          
          <Text style={styles.scoreMessage}>{getScoreMessage()}</Text>
          
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: getScoreImage() }}
              style={styles.resultImage}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.levelInfo}>
            <Text style={styles.levelInfoText}>
              {level}단계 퀴즈 {level === 1 ? '(20문제)' : level === 2 ? '(25문제)' : '(20문제)'}
            </Text>
          </View>
        </View>
        
        <View style={styles.buttonsContainer}>
          <Button
            title="다시 도전하기"
            onPress={handleRetryQuiz}
            style={styles.button}
            variant="primary"
            size="large"
          />
          
          <Button
            title="홈으로 돌아가기"
            onPress={handleGoHome}
            style={{ ...styles.button, ...styles.homeButton }}
            variant="outline"
            size="large"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  resultContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    marginVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  scoreContainer: {
    marginBottom: 24,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primary,
  },
  scoreText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.textLight,
  },
  scoreMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.text,
    marginBottom: 24,
    lineHeight: 24,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  levelInfo: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  levelInfoText: {
    color: '#fff',
    fontWeight: '500',
  },
  buttonsContainer: {
    marginTop: 16,
  },
  button: {
    marginBottom: 16,
  },
  homeButton: {
    marginBottom: 32,
  },
});