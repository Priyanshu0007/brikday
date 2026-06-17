import React from 'react';
import { View, ViewStyle, StyleProp, ActivityIndicator } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { createAnimatedPressable } from 'pressto';
import { triggerHaptic, HapticFeedbackType } from './haptics';
import { Typography } from './Typography';

const PressableBrutalist = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [
      { translateX: progress * 4 },
      { translateY: progress * 4 },
    ],
  };
});

interface BrutalistButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  hapticFeedback?: HapticFeedbackType;
}

export function BrutalistButton({
  children,
  onPress,
  backgroundColor,
  textColor,
  style,
  disabled = false,
  loading = false,
  size = 'md',
  hapticFeedback = 'light',
}: BrutalistButtonProps) {
  const { theme } = useUnistyles();
  
  const finalBackgroundColor = backgroundColor || theme.colors.warning;
  const finalTextColor = textColor || theme.colors.text;

  const handlePress = () => {
    if (disabled || loading) return;
    triggerHaptic(hapticFeedback);
    if (onPress) {
      onPress();
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 32 };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  return (
    <View style={[stylesheet.outer, style]}>
      <View style={stylesheet.buttonOuter}>
        {/* Shadow Layer */}
        <View style={stylesheet.shadow} />
        
        {/* @ts-ignore */}
        <PressableBrutalist
          // @ts-ignore
          disabled={disabled || loading}
          onPress={handlePress}
          style={stylesheet.pressable}
        >
          <View
            style={[
              stylesheet.button,
              getPadding(),
              { backgroundColor: finalBackgroundColor },
              disabled && stylesheet.disabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={finalTextColor} size="small" />
            ) : typeof children === 'string' ? (
              <Typography 
                variant="bodyBold" 
                style={{ color: finalTextColor, textAlign: 'center' }} 
                uppercase
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {children}
              </Typography>
            ) : (
              children
            )}
          </View>
        </PressableBrutalist>
      </View>
    </View>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
  outer: {
    alignSelf: 'stretch',
  },
  buttonOuter: {
    alignSelf: 'stretch',
    position: 'relative',
    paddingRight: 4,
    paddingBottom: 4,
  },
  pressable: {
    alignSelf: 'stretch',
  },
  shadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius,
  },
  button: {
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: '#CCCCCC',
  },
}));
