import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '@/constants/colors';

interface ProgressBarProps {
  current: number;
  total: number;
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  showText = true 
}) => {
  const progress = (current / total) * 100;
  
  return (
    <View style={styles.container}>
      {showText && (
        <Text style={styles.text}>
          {current} / {total}
        </Text>
      )}
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${progress}%` }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  text: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 5,
    textAlign: 'right',
  },
  progressContainer: {
    height: 8,
    backgroundColor: colors.backgroundLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});