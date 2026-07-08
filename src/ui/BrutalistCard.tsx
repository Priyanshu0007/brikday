import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { createAnimatedPressable } from 'pressto';
import { triggerHaptic, HapticFeedbackType } from './haptics';

const PressableBrutalist4 = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [{ translateX: progress * 4 }, { translateY: progress * 4 }],
  };
});


interface BrutalistCardProps {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  neglected?: boolean;
  accentColor?: string;
  onPress?: () => void;
  hapticFeedback?: HapticFeedbackType;
}

export function BrutalistCard({
  children,
  backgroundColor,
  style,
  neglected = false,
  accentColor,
  onPress,
  hapticFeedback = 'soft',
}: BrutalistCardProps) {
  const { theme } = useUnistyles();

  const finalBackgroundColor = backgroundColor || theme.colors.paper;

  // When neglected, the card decays: turns background to danger red, but keeps same shadow offset for alignment.
  const activeBgColor = neglected ? theme.colors.danger : accentColor || finalBackgroundColor;

  const offset = 4;

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(activeBgColor, { duration: 200 }),
    };
  }, [activeBgColor]);

  const handlePress = () => {
    if (!onPress) return;
    triggerHaptic(hapticFeedback);
    onPress();
  };

  const PressableWrapper = onPress ? PressableBrutalist4 : View;

  return (
    <View style={[stylesheet.cardWrapper, style, { paddingRight: offset, paddingBottom: offset }]}>
      {/* Shadow layer behind */}
      <View
        style={[
          stylesheet.shadowLayer,
          {
            top: offset,
            left: offset,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.border,
          },
        ]}
      />

      {/* Foreground card layer */}
      {/* @ts-ignore */}
      <PressableWrapper onPress={onPress ? handlePress : undefined}>
        <Animated.View style={[stylesheet.card, animatedCardStyle]}>{children}</Animated.View>
      </PressableWrapper>
    </View>
  );
}

const stylesheet = StyleSheet.create((theme) => ({
  cardWrapper: {
    alignSelf: 'stretch',
    marginVertical: 6,
    position: 'relative',
  },
  shadowLayer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  card: {
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    padding: 16,
  },
}));
