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
import { appState$, appActions } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';

// Chunky draggable slider component inside the goal cards
const ChunkySlider = observer(({ goalId }: { goalId: string }) => {
  const goal$ = appState$.vaultGoals.find((g) => g.id.get() === goalId);
  if (!goal$) return null;

  // Fine-grained observable tracking: observer will re-render ONLY when these specific fields change
  const saved = goal$.saved.get();
  const target = goal$.target.get();
  const title = goal$.title.get();

  const [trackWidth, setTrackWidth] = useState(0);
  const activeX = useSharedValue(0);
  const startX = useSharedValue(0);

  // JS-thread ref for drag state — reliable for useEffect guards (unlike shared values read cross-thread)
  const isDraggingRef = React.useRef(false);

  const progress = target > 0 ? saved / target : 0;
  const percentage = Math.round(progress * 100);

  // Sync slider position on layout measure
  const handleLayout = (e: any) => {
    const width = e.nativeEvent.layout.width;
    setTrackWidth(width);
    if (!isDraggingRef.current) {
      activeX.value = (target > 0 ? saved / target : 0) * width;
    }
  };

  // Keep shared value in sync when state updates externally (NOT from our own drag)
  React.useEffect(() => {
    if (trackWidth > 0 && !isDraggingRef.current) {
      activeX.value = progress * trackWidth;
    }
  }, [saved, target, trackWidth]);

  const updateSaved = (newSaved: number) => {
    appActions.updateVaultGoal(goalId, newSaved);
  };

  const setDragging = (value: boolean) => {
    isDraggingRef.current = value;
  };

  const lastUpdatedSaved = useSharedValue(saved);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(setDragging)(true);
      startX.value = activeX.value;
      lastUpdatedSaved.value = saved;
    })
    .onUpdate((event) => {
      if (trackWidth <= 0) return;
      const nextX = startX.value + event.translationX;
      const clampedX = Math.max(0, Math.min(trackWidth, nextX));
      activeX.value = clampedX;

      const newSaved = Math.round((clampedX / trackWidth) * target);

      // Only bridge to JS thread when the rounded value actually changes
      if (newSaved !== lastUpdatedSaved.value) {
        lastUpdatedSaved.value = newSaved;
        runOnJS(updateSaved)(newSaved);
      }
    })
    .onEnd(() => {
      runOnJS(setDragging)(false);
    });

  const fillStyle = useAnimatedStyle(() => ({
    width: activeX.value,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activeX.value - 12 }],
  }));

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Typography variant="bodyBold">{title}</Typography>
        <Typography variant="mono" style={styles.percentBadge}>
          {percentage}%
        </Typography>
      </View>

      <Typography variant="caption" style={styles.savedCaption}>
        ${saved.toLocaleString()} / ${target.toLocaleString()} SAVED (FULL PAY)
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

// Memoized card wrapper — prevents gesture handler recreation on parent re-render
const GoalCard = React.memo(({ goalId }: { goalId: string }) => (
  <BrutalistCard style={styles.cardSpacing} backgroundColor="#FFFFFF">
    <ChunkySlider goalId={goalId} />
  </BrutalistCard>
));

export const VaultScreen = observer(function VaultScreen() {
  const goals = appState$.vaultGoals.get();

  // Stable ID array — only recomputes when goals are added/removed, NOT on saved changes
  const goalIds = React.useMemo(
    () => goals.map((g) => g.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [goals.length],
  );

  // Stable render function — never recreated
  const renderGoalItem = React.useCallback(
    ({ item }: { item: string }) => <GoalCard goalId={item} />,
    [],
  );

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
        data={goalIds}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item}
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
