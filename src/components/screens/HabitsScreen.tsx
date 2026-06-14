import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { observer } from '@legendapp/state/react';
import { LegendList } from '@legendapp/list/react-native';
import { habitsState$, appActions } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import {
  getLocalDateString,
  isHabitActiveOnDate,
} from '@/utils/date';

const AnimatedTypography = Animated.createAnimatedComponent(Typography);

const HabitItem = observer(({ habitId }: { habitId: string }) => {
  const item$ = habitsState$.find((h) => h.id.get() === habitId);
  if (!item$) return null;

  const title = item$.title.get();
  const completedDates = item$.completedDates.get() || [];
  const todayStr = getLocalDateString();
  const isCompleted = completedDates.includes(todayStr);
  const isNeglected = item$.neglected.get() && !isCompleted;

  // Reanimated styles
  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(
        isCompleted ? '#000000' : isNeglected ? '#FFFFFF' : BRUTALIST_THEME.colors.text,
        { duration: 200 }
      ),
      opacity: withTiming(isCompleted ? 0.75 : 1, { duration: 200 }),
    };
  }, [isCompleted, isNeglected]);

  const strikeAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(isCompleted ? '100%' : '0%', { duration: 300 }),
    };
  }, [isCompleted]);

  const tickAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isCompleted ? 1 : 0, { duration: 200 }),
      transform: [{ scale: withSpring(isCompleted ? 1 : 0.5) }],
    };
  }, [isCompleted]);

  return (
    <BrutalistCard
      accentColor={isCompleted ? BRUTALIST_THEME.colors.success : undefined}
      neglected={isNeglected}
      style={styles.cardSpacing}
      onPress={() => appActions.toggleHabit(habitId)}
    >
      <View style={styles.itemRow}>
          {/* Custom styled checkbox indicator */}
          <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
            <Animated.View style={tickAnimatedStyle}>
              <Typography variant="bodyBold" color="#000000" style={styles.checkboxTick}>
                ✓
              </Typography>
            </Animated.View>
          </View>
          
          <View style={styles.textContainer}>
            <View style={{ alignSelf: 'flex-start' }}>
              <AnimatedTypography
                variant="bodyBold"
                style={[textAnimatedStyle]}
              >
                {title}
              </AnimatedTypography>
              {/* Custom Animated Strikethrough Line */}
              <Animated.View style={[styles.customStrike, strikeAnimatedStyle]} />
            </View>
            
            {isNeglected && (
              <Typography variant="caption" style={{ color: '#FFD2D2', marginTop: 2 }}>
                ⚠️ You missed this yesterday.
              </Typography>
            )}
          </View>
        </View>
      </BrutalistCard>
  );
});

export const HabitsScreen = observer(function HabitsScreen() {
  const habits = habitsState$.get();

  // Synchronize Legend State persistence on load
  useEffect(() => {
    const todayStr = getLocalDateString();
    const yesterdayStr = getLocalDateString(new Date(Date.now() - 86400000));

    habitsState$.get().forEach((h, index) => {
      const completedDates = h.completedDates || [];
      const hasToday = completedDates.includes(todayStr);
      const hasYesterday = completedDates.includes(yesterdayStr);

      const obsHabit = habitsState$[index];

      // Sync completed
      if (h.completed !== hasToday) {
        obsHabit.completed.set(hasToday);
      }

      // Sync neglected
      const isYesterdayActive = isHabitActiveOnDate(h, new Date(Date.now() - 86400000));
      const shouldBeNeglected = isYesterdayActive && !hasYesterday && !hasToday;
      if (h.neglected !== shouldBeNeglected) {
        obsHabit.neglected.set(shouldBeNeglected);
      }
    });
  }, []);

  // Filter habit IDs for today's active habits
  const habitIds = React.useMemo(
    () => habits.filter(h => isHabitActiveOnDate(h, new Date())).map((h) => h.id),
    [habits]
  );

  const renderItem = React.useCallback(
    ({ item }: { item: string }) => <HabitItem habitId={item} />,
    []
  );

  return (
    <View style={styles.container}>
      {/* Title block */}
      <View style={styles.header}>
        <Typography variant="h2" uppercase>
          HABITS
        </Typography>
        <Typography variant="mono" style={styles.subtitle}>
          YOUR DAILY HABITS
        </Typography>
      </View>

      {/* High performance LegendList */}
      <LegendList
        data={habitIds}
        renderItem={renderItem}
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
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 100, // Extra space to clear tab bar
  },
  cardSpacing: {
    marginVertical: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2.5,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF',
  },
  checkboxTick: {
    fontSize: 14,
    lineHeight: 18,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  customStrike: {
    position: 'absolute',
    top: '50%',
    left: 0,
    height: 2,
    backgroundColor: '#000000',
    marginTop: -1,
  },
});
