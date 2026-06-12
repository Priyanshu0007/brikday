import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, ActivityIndicator } from 'react-native';
import { createAnimatedPressable } from 'pressto';
import * as Haptics from 'expo-haptics'; // Since it's standard in Expo to use haptics
import { BRUTALIST_THEME } from './theme';
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
}

export function BrutalistButton({
  children,
  onPress,
  backgroundColor = BRUTALIST_THEME.colors.warning,
  textColor = BRUTALIST_THEME.colors.text,
  style,
  disabled = false,
  loading = false,
  size = 'md',
}: BrutalistButtonProps) {
  
  const handlePress = () => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Ignore haptics fail on web
    }
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
    <View style={[styles.outer, style]}>
      <View style={styles.buttonOuter}>
        {/* Shadow Layer */}
        <View style={styles.shadow} />
        
        {/* Button layer wrapped in PressableBrutalist */}
        <PressableBrutalist
          disabled={disabled || loading}
          onPress={handlePress}
          style={styles.pressable}
        >
          <View
            style={[
              styles.button,
              getPadding(),
              { backgroundColor },
              disabled && styles.disabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={textColor} size="small" />
            ) : typeof children === 'string' ? (
              <Typography 
                variant="bodyBold" 
                style={{ color: textColor, textAlign: 'center' }} 
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

const styles = StyleSheet.create({
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
    backgroundColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
  },
  button: {
    borderWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: '#CCCCCC',
  },
});
