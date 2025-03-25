import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuizStore } from '@/store/quiz-store';
import { ResultCard } from '@/components/ResultCard';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { History, ArrowLeft } from 'lucide-react-native';

export default function HistoryScreen() {
  const router = useRouter();
  const { quizHistory } = useQuizStore();
  
  const handleGoBack = () => {
    router.back();
  };
  
  const renderEmptyHistory = () => (
    <View style={styles.emptyContainer}>
      <History size={64} color={colors.textLight} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>기록이 없습니다</Text>
      <Text style={styles.emptyDescription}>
        퀴즈를 풀고 나면 여기에 결과가 기록됩니다.
      </Text>
      <Button
        title="퀴즈 시작하기"
        onPress={() => router.replace('/')}
        style={styles.startButton}
        variant="primary"
      />
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>퀴즈 기록</Text>
        <Text style={styles.headerSubtitle}>
          지금까지 푼 퀴즈의 결과를 확인하세요
        </Text>
      </View>
      
      {quizHistory.length > 0 ? (
        <FlatList
          data={quizHistory}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          renderItem={({ item }) => <ResultCard result={item} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        renderEmptyHistory()
      )}
      
      <View style={styles.buttonContainer}>
        <Button
          title="뒤로 가기"
          onPress={handleGoBack}
          variant="outline"
          style={styles.backButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  startButton: {
    width: '80%',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    width: '100%',
  },
});