import React from 'react';
import { View } from 'react-native';
import {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { styles } from './styles';

interface SlideContentProps {
  index: number;
  activeIndex: SharedValue<number>;
  children: React.ReactNode;
}

export function SlideContent({ index, activeIndex, children }: SlideContentProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      activeIndex.value,
      [index - 0.6, index, index + 0.6],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      activeIndex.value,
      [index - 0.6, index, index + 0.6],
      [30, 0, 30],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <View style={styles.slideOuter}>
      <Animated.View style={[styles.slideInner, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}
