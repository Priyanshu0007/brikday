import React from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';
import { styles } from './styles';

interface AnimatedDotProps {
  index: number;
  activeIndex: SharedValue<number>;
}

export function AnimatedDot({ index, activeIndex }: AnimatedDotProps) {
  const { theme } = useUnistyles();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];
    const width = interpolate(
      activeIndex.value,
      inputRange,
      [10, 28, 10],
      Extrapolation.CLAMP,
    );
    const bgColor = interpolateColor(
      activeIndex.value,
      inputRange,
      [theme.colors.textMuted, theme.colors.border, theme.colors.textMuted],
    );
    return { width, backgroundColor: bgColor };
  }, [theme.colors.border, theme.colors.textMuted]);

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}
