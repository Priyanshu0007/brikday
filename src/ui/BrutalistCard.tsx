import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { createAnimatedPressable } from 'pressto';
import * as Haptics from 'expo-haptics';
import { BRUTALIST_THEME } from './theme';

const PressableBrutalist4 = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [
      { translateX: progress * 4 },
      { translateY: progress * 4 },
    ],
  };
});

const PressableBrutalist8 = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [
      { translateX: progress * 8 },
      { translateY: progress * 8 },
    ],
  };
});

interface BrutalistCardProps {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  neglected?: boolean;
  accentColor?: string;
  onPress?: () => void;
}

export function BrutalistCard({
  children,
  backgroundColor = BRUTALIST_THEME.colors.paper,
  style,
  neglected = false,
  accentColor,
  onPress,
}: BrutalistCardProps) {
  
  // When neglected, the card decays: turns background to danger red, but keeps same shadow offset for alignment.
  const activeBgColor = neglected 
    ? BRUTALIST_THEME.colors.danger 
    : (accentColor || backgroundColor);
  
  const offset = 4;

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(activeBgColor, { duration: 200 }),
    };
  }, [activeBgColor]);

  const handlePress = () => {
    if (!onPress) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore haptics fail on web
    }
    onPress();
  };

  const PressableWrapper = onPress ? PressableBrutalist4 : View;

  return (
    <View 
      style={[
        styles.cardWrapper, 
        style, 
        { paddingRight: offset, paddingBottom: offset }
      ]}
    >
      {/* Shadow layer behind */}
      <View
        style={[
          styles.shadowLayer,
          {
            top: offset,
            left: offset,
            borderRadius: BRUTALIST_THEME.borderRadius,
            backgroundColor: BRUTALIST_THEME.colors.border,
          },
        ]}
      />
      
      {/* Foreground card layer */}
      {/* @ts-ignore */}
      <PressableWrapper onPress={onPress ? handlePress : undefined}>
        <Animated.View
          style={[
            styles.card,
            animatedCardStyle,
          ]}
        >
          {children}
        </Animated.View>
      </PressableWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
    padding: 16,
  },
});
