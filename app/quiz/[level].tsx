import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQuizStore } from '@/store/quiz-store';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { QuizOption } from '@/components/QuizOption';
import { QuizCard } from '@/components/QuizCard';
import { colors } from '@/constants/colors';

export default function QuizScreen() {
  const router = useRouter();
  const { level } = useLocalSearchParams<{ level: string }>();
  const levelNumber = parseInt(level || '1', 10);
  
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  
  const { 
    quizState, 
    initQuiz, 
    answerQuestion, 
    nextQuestion, 
    resetQuiz 
  } = useQuizStore();
  
  const { 
    currentQuestion, 
    questions, 
    answers, 
    isCompleted, 
    score 
  } = quizState;
  
  useEffect(() => {
    initQuiz(levelNumber);
    
    return () => {
      // Clean up when leaving the screen
      resetQuiz();
    };
  }, [levelNumber]);
  
  useEffect(() => {
    if (isCompleted) {
      router.replace('/results');
    }
  }, [isCompleted]);
  
  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>문제를 불러오는 중...</Text>
      </View>
    );
  }
  
  const currentQuestionData = questions[currentQuestion];
  const userAnswer = answers[currentQuestion];
  
  const handleSelectOption = (option: string) => {
    if (showAnswer) return;
    answerQuestion(option);
  };
  
  const handleSubmitAnswer = () => {
    if (levelNumber === 3) {
      answerQuestion(userInput.trim());
    }
    
    setShowAnswer(true);
  };
  
  const handleNextQuestion = () => {
    setShowAnswer(false);
    setUserInput('');
    nextQuestion();
  };
  
  const isAnswerCorrect = userAnswer === currentQuestionData.correctAnswer;
  
  const renderQuizContent = () => {
    if (levelNumber === 3) {
      // Level 3: Text input (subjective)
      return (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="사자성어를 입력하세요"
            placeholderTextColor={colors.textLight}
            autoCapitalize="none"
            editable={!showAnswer}
            onFocus={() => setShowAnswer(false)}
          />
          
          {showAnswer && (
            <View style={styles.answerFeedback}>
              <Text style={[
                styles.feedbackText,
                isAnswerCorrect ? styles.correctText : styles.incorrectText
              ]}>
                {isAnswerCorrect ? '정답입니다!' : '틀렸습니다.'}
              </Text>
              <Text style={styles.correctAnswerText}>
                정답: {currentQuestionData.correctAnswer}
              </Text>
            </View>
          )}
        </View>
      );
    } else {
      // Level 1 & 2: Multiple choice
      return (
        <View>
          {currentQuestionData.options.map((option, index) => (
            <QuizOption
              key={index}
              text={option}
              selected={userAnswer === option}
              correct={showAnswer ? option === currentQuestionData.correctAnswer : null}
              onSelect={() => handleSelectOption(option)}
              disabled={showAnswer}
            />
          ))}
          
          {showAnswer && !isAnswerCorrect && (
            <Text style={styles.correctAnswerText}>
              정답: {currentQuestionData.correctAnswer}
            </Text>
          )}
        </View>
      );
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <Stack.Screen 
            options={{ 
              title: `${levelNumber}단계 퀴즈`,
              headerBackVisible: false,
            }} 
          />
          
          <View style={styles.progressContainer}>
            <ProgressBar 
              current={currentQuestion + 1} 
              total={questions.length} 
            />
          </View>
          
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <QuizCard question={currentQuestionData}>
              {renderQuizContent()}
            </QuizCard>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            {!showAnswer ? (
              <Button
                title="정답 확인"
                onPress={handleSubmitAnswer}
                disabled={levelNumber === 3 ? !userInput.trim() : !userAnswer}
                style={styles.button}
              />
            ) : (
              <Button
                title={
                  currentQuestion < questions.length - 1
                    ? "다음 문제"
                    : "결과 보기"
                }
                onPress={handleNextQuestion}
                style={styles.button}
              />
            )}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  inputContainer: {
    marginTop: 16,
  },
  textInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  answerFeedback: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.backgroundLight,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  correctText: {
    color: colors.success,
  },
  incorrectText: {
    color: colors.error,
  },
  correctAnswerText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    width: '100%',
  },
});