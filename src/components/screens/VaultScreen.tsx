"use no memo";
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from '@legendapp/state/react';
import { LegendList } from '@legendapp/list/react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { appState$, appActions, VaultGoal } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';

// Chunky draggable slider component inside the goal cards
const ChunkySlider = observer(({ goal }: { goal: VaultGoal }) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const activeX = useSharedValue(0);
  const startX = useSharedValue(0);

  const calculateProgress = () => {
    if (goal.target <= 0) return 0;
    return goal.saved / goal.target;
  };

  // Sync position on layout
  const handleLayout = (e: any) => {
    const width = e.nativeEvent.layout.width;
    setTrackWidth(width);
    const progress = calculateProgress();
    activeX.value = progress * width;
  };

  const updateStateValue = (prog: number) => {
    const newSaved = Math.round(prog * goal.target);
    appActions.updateVaultGoal(goal.id, newSaved);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = activeX.value;
    })
    .onUpdate((event) => {
      if (trackWidth <= 0) return;
      const nextX = startX.value + event.translationX;
      // Clamp between 0 and trackWidth
      const clampedX = Math.max(0, Math.min(trackWidth, nextX));
      activeX.value = clampedX;

      const progress = clampedX / trackWidth;
      runOnJS(updateStateValue)(progress);
    });

  const fillStyle = useAnimatedStyle(() => {
    return {
      width: activeX.value,
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: activeX.value - 12 }],
    };
  });

  const percentage = Math.round(calculateProgress() * 100);

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Typography variant="bodyBold">{goal.title}</Typography>
        <Typography variant="mono" style={styles.percentBadge}>
          {percentage}%
        </Typography>
      </View>

      <Typography variant="caption" style={styles.savedCaption}>
        ${goal.saved.toLocaleString()} / ${goal.target.toLocaleString()} SAVED (FULL PAY)
      </Typography>

      {/* Slider track wrapper */}
      <GestureDetector gesture={panGesture}>
        <View style={styles.trackContainer} onLayout={handleLayout}>
          {/* Main track */}
          <View style={styles.track}>
            {/* Animated Progress Fill */}
            <Animated.View style={[styles.progressFill, fillStyle]} />
          </View>

          {/* Chunky Drag handle */}
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </View>
      </GestureDetector>

      <Typography variant="caption" style={styles.sliderHint}>
        ◀ DRAG HANDLE TO ALLOCATE CAPITAL ▶
      </Typography>
    </View>
  );
});

export const VaultScreen = observer(function VaultScreen() {
  const goals = appState$.vaultGoals.get();

  const renderGoalItem = ({ item }: { item: VaultGoal }) => {
    return (
      <BrutalistCard style={styles.cardSpacing} backgroundColor="#FFFFFF">
        <ChunkySlider goal={item} />
      </BrutalistCard>
    );
  };

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.header}>
        <Typography variant="h2" uppercase>
          THE VAULT
        </Typography>
        <Typography variant="mono" style={styles.subtitle}>
          ZERO EMI // FULL CASH ACQUISITIONS
        </Typography>
      </View>

      {/* Goal Cards List */}
      <LegendList
        data={goals}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 10,
    color: BRUTALIST_THEME.colors.textMuted,
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100, // Clear the bottom tabs
  },
  cardSpacing: {
    marginVertical: 8,
  },
  sliderContainer: {
    paddingVertical: 4,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  percentBadge: {
    backgroundColor: BRUTALIST_THEME.colors.border,
    color: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: 'bold',
    borderRadius: 2,
  },
  savedCaption: {
    color: BRUTALIST_THEME.colors.textMuted,
    marginBottom: 12,
    fontFamily: BRUTALIST_THEME.fonts.mono,
  },
  trackContainer: {
    height: 32,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 8,
  },
  track: {
    height: 16,
    backgroundColor: BRUTALIST_THEME.colors.paper,
    borderWidth: 2,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BRUTALIST_THEME.colors.warning,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: BRUTALIST_THEME.colors.border,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 4,
  },
  sliderHint: {
    textAlign: 'center',
    fontSize: 9,
    color: BRUTALIST_THEME.colors.textMuted,
    marginTop: 6,
    fontFamily: BRUTALIST_THEME.fonts.mono,
  },
});
