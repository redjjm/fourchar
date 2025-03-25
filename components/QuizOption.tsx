import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface QuizOptionProps {
  text: string;
  selected: boolean;
  correct?: boolean | null;
  onSelect: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const QuizOption: React.FC<QuizOptionProps> = ({
  text,
  selected,
  correct,
  onSelect,
  disabled = false,
  style
}) => {
  const getBackgroundColor = () => {
    if (correct === true) return colors.success;
    if (correct === false) return colors.error;
    if (selected) return colors.primaryLight;
    return colors.backgroundLight;
  };
  
  const getBorderColor = () => {
    if (correct === true) return colors.success;
    if (correct === false) return colors.error;
    if (selected) return colors.primary;
    return colors.border;
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        style
      ]}
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text 
        style={[
          styles.text,
          selected && styles.selectedText,
          correct === true && styles.correctText,
          correct === false && styles.incorrectText
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  selectedText: {
    color: colors.text,
    fontWeight: '600',
  },
  correctText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  incorrectText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});