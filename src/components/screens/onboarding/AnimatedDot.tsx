import React from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { styles } from './styles';

interface AnimatedDotProps {
  index: number;
  activeIndex: SharedValue<number>;
}

export function AnimatedDot({ index, activeIndex }: AnimatedDotProps) {
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
      ['#D1D5DB', '#000000', '#D1D5DB'],
    );
    return { width, backgroundColor: bgColor };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}
