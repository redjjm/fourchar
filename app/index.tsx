import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { Book, Award, History, Brain } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  
  const handleStartQuiz = (level: number) => {
    router.push(`/quiz/${level}`);
  };
  
  const handleViewHistory = () => {
    router.push('/history');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=300&auto=format&fit=crop' }} 
            style={styles.logo}
          />
          <Text style={styles.title}>사자성어 퀴즈</Text>
          <Text style={styles.subtitle}>한국 전통 사자성어를 배우고 테스트해보세요</Text>
        </View>
        
        <View style={styles.levelsContainer}>
          <Text style={styles.sectionTitle}>난이도 선택</Text>
          
          <TouchableOpacity 
            style={styles.levelCard}
            onPress={() => handleStartQuiz(1)}
            activeOpacity={0.8}
          >
            <View style={styles.levelIconContainer}>
              <Brain size={24} color={colors.primary} />
            </View>
            <View style={styles.levelContent}>
              <Text style={styles.levelTitle}>1단계</Text>
              <Text style={styles.levelDescription}>
                사자성어의 뜻을 보고 2개의 보기 중 맞는 사자성어를 고르세요.
              </Text>
              <Text style={styles.levelDetails}>20문제 · 쉬움</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.levelCard}
            onPress={() => handleStartQuiz(2)}
            activeOpacity={0.8}
          >
            <View style={styles.levelIconContainer}>
              <Book size={24} color={colors.primary} />
            </View>
            <View style={styles.levelContent}>
              <Text style={styles.levelTitle}>2단계</Text>
              <Text style={styles.levelDescription}>
                사자성어의 뜻을 보고 4개의 보기 중 맞는 사자성어를 고르세요.
              </Text>
              <Text style={styles.levelDetails}>25문제 · 보통</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.levelCard}
            onPress={() => handleStartQuiz(3)}
            activeOpacity={0.8}
          >
            <View style={styles.levelIconContainer}>
              <Award size={24} color={colors.primary} />
            </View>
            <View style={styles.levelContent}>
              <Text style={styles.levelTitle}>3단계</Text>
              <Text style={styles.levelDescription}>
                사자성어의 뜻을 보고 사자성어를 직접 입력하세요.
              </Text>
              <Text style={styles.levelDetails}>20문제 · 어려움</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.historyButtonContainer}>
          <Button
            title="기록 보기"
            onPress={handleViewHistory}
            variant="outline"
            style={styles.historyButton}
            textStyle={styles.historyButtonText}
            size="medium"
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
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  levelsContainer: {
    marginBottom: 24,
  },
  levelCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  levelIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelContent: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
    lineHeight: 20,
  },
  levelDetails: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  historyButtonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  historyButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyButtonText: {
    marginLeft: 8,
  },
});