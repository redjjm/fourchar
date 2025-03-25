import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import { colors } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle
}) => {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = {};
    
    // Variant styles
    if (variant === 'primary') {
      buttonStyle.backgroundColor = colors.primary;
    } else if (variant === 'secondary') {
      buttonStyle.backgroundColor = colors.secondary;
    } else if (variant === 'outline') {
      buttonStyle.backgroundColor = 'transparent';
      buttonStyle.borderWidth = 1;
      buttonStyle.borderColor = colors.primary;
    }
    
    // Size styles
    if (size === 'small') {
      buttonStyle.paddingVertical = 8;
      buttonStyle.paddingHorizontal = 16;
    } else if (size === 'medium') {
      buttonStyle.paddingVertical = 12;
      buttonStyle.paddingHorizontal = 24;
    } else if (size === 'large') {
      buttonStyle.paddingVertical = 16;
      buttonStyle.paddingHorizontal = 32;
    }
    
    // Disabled style
    if (disabled) {
      buttonStyle.opacity = 0.5;
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleObj: TextStyle = {};
    
    if (variant === 'outline') {
      textStyleObj.color = colors.primary;
    } else {
      textStyleObj.color = '#FFFFFF';
    }
    
    if (size === 'small') {
      textStyleObj.fontSize = 14;
    } else if (size === 'medium') {
      textStyleObj.fontSize = 16;
    } else if (size === 'large') {
      textStyleObj.fontSize = 18;
    }
    
    return textStyleObj;
  };
  
  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : '#FFFFFF'} />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  }
});