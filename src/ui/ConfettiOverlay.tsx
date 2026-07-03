import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Typography } from './Typography';
import { triggerHaptic } from './haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const NUM_PARTICLES = 40;

const Particle = ({ color, isActive }: { color: string; isActive: boolean }) => {
  const config = React.useMemo(() => {
    const startX = Math.random() * SCREEN_WIDTH;
    const endX = startX + (Math.random() - 0.5) * 300;
    const startY = -50;
    const endY = SCREEN_HEIGHT + 50;

    const size = 8 + Math.random() * 8;
    const isRect = Math.random() > 0.5;
    const width = isRect ? size * 1.5 : size;

    const rotationStart = Math.random() * 360;
    const rotationEnd =
      rotationStart + (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 720);

    const duration = 1500 + Math.random() * 1000;
    const delay = Math.random() * 200;
    return { startX, endX, startY, endY, size, width, rotationStart, rotationEnd, duration, delay };
  }, []);

  const translateY = useSharedValue(config.startY);
  const translateX = useSharedValue(config.startX);
  const rotation = useSharedValue(config.rotationStart);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      opacity.value = 1;
      translateY.value = config.startY;
      translateX.value = config.startX;
      rotation.value = config.rotationStart;

      translateY.value = withDelay(
        config.delay,
        withTiming(config.endY, {
          duration: config.duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      );
      translateX.value = withDelay(
        config.delay,
        withTiming(config.endX, {
          duration: config.duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      );
      rotation.value = withDelay(
        config.delay,
        withTiming(config.rotationEnd, { duration: config.duration, easing: Easing.linear }),
      );
    }
  }, [isActive, config, translateX, translateY, rotation, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const { theme } = useUnistyles();

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: config.width,
          height: config.size,
          backgroundColor: color,
          borderColor: theme.colors.border,
        },
        animatedStyle,
      ]}
    />
  );
};

export const ConfettiOverlay = ({
  isActive,
  onComplete,
  text = 'ALL HABITS COMPLETE 🎉',
  bannerColor,
}: {
  isActive: boolean;
  onComplete?: () => void;
  text?: string;
  bannerColor?: string;
}) => {
  const { theme } = useUnistyles();
  const [particles, setParticles] = useState<string[]>([]);

  const bannerScale = useSharedValue(0);
  const bannerOpacity = useSharedValue(0);
  const bannerTranslateY = useSharedValue(50);

  useEffect(() => {
    if (isActive) {
      triggerHaptic('success');

      const colors = [
        theme.colors.success,
        theme.colors.warning,
        theme.colors.danger,
        '#FF69B4',
        '#8B5CF6',
      ];

      const newParticles = Array.from({ length: NUM_PARTICLES }).map(
        () => colors[Math.floor(Math.random() * colors.length)],
      );
      setParticles(newParticles);

      // Animate banner in, then out
      bannerOpacity.value = withTiming(1, { duration: 300 });
      bannerScale.value = withSpring(1, { damping: 12, stiffness: 100 });
      bannerTranslateY.value = withSpring(0, { damping: 12, stiffness: 100 });

      const outTimer = setTimeout(() => {
        bannerOpacity.value = withTiming(0, { duration: 300 });
        bannerTranslateY.value = withTiming(-50, { duration: 300 });
      }, 2000);

      const completeTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);

      return () => {
        clearTimeout(outTimer);
        clearTimeout(completeTimer);
      };
    } else {
      bannerScale.value = 0;
      bannerOpacity.value = 0;
      bannerTranslateY.value = 50;
    }
  }, [isActive, theme.colors, bannerOpacity, bannerScale, bannerTranslateY, onComplete]);

  const bannerStyle = useAnimatedStyle(() => ({
    opacity: bannerOpacity.value,
    transform: [{ scale: bannerScale.value }, { translateY: bannerTranslateY.value }],
  }));

  if (!isActive) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((color, index) => (
        <Particle key={index} color={color} isActive={isActive} />
      ))}
      <Animated.View style={[styles.bannerWrapper, bannerStyle]}>
        <View style={[styles.banner, bannerColor ? { backgroundColor: bannerColor } : null]}>
          <Typography variant="h3" uppercase style={styles.bannerText}>
            {text}
          </Typography>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 2,
  },
  bannerWrapper: {
    position: 'absolute',
    top: '20%',
  },
  banner: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 3,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  bannerText: {
    color: theme.colors.background,
    textAlign: 'center',
  },
}));
