import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';
import { Question } from '@/types/quiz';

interface QuizCardProps {
  question: Question;
  children: React.ReactNode;
}

const { width } = Dimensions.get('window');

export const QuizCard: React.FC<QuizCardProps> = ({ question, children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: question.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.meaningTitle}>뜻:</Text>
        <Text style={styles.meaning}>{question.meaning}</Text>
        
        <View style={styles.optionsContainer}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: width * 0.5,
    backgroundColor: colors.backgroundLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  meaningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 4,
  },
  meaning: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    marginTop: 8,
  },
});