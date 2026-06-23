import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { observer } from '@legendapp/state/react';
import { todayLog$ } from '@/state/store';
import { triggerHaptic } from '@/ui/haptics';

const VoxelBrick = ({ isCompleted }: { isCompleted: boolean }) => {
  const { theme } = useUnistyles();
  const translateY = useSharedValue(isCompleted ? 0 : -200);
  const opacity = useSharedValue(isCompleted ? 1 : 0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isCompleted) {
      if (translateY.value !== 0) {
        opacity.value = 1;
        // Drop animation
        translateY.value = withSpring(0, {
          damping: 12,
          stiffness: 100,
          mass: 1,
        }, (finished) => {
          if (finished) {
            runOnJS(triggerHaptic)('rigid');
          }
        });
      }
    } else {
      // Revert instantly if unchecked
      translateY.value = -200;
      opacity.value = 0;
    }
  }, [isCompleted, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.slot}>
      <Animated.View style={[styles.brick, { backgroundColor: theme.colors.success }, animatedStyle]} />
    </View>
  );
};

export const VoxelTower = observer(() => {
  const log = todayLog$.get();
  if (!log || log.entries.length === 0) return null;

  return (
    <View style={styles.towerContainer} pointerEvents="none">
      {log.entries.map((entry) => (
        <VoxelBrick key={entry.habitId} isCompleted={entry.completed} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  towerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 6,
    marginBottom: 20,
    marginTop: 10,
    overflow: 'visible',
    zIndex: 100, // keep bricks above everything
  },
  slot: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius,
    overflow: 'visible',
  },
  brick: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    // Hard shadow for neo-brutalism
    shadowColor: theme.colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3, // for android
  }
}));
