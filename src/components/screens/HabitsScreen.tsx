import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

import Animated, { useAnimatedStyle, withTiming, withSpring, interpolateColor } from 'react-native-reanimated';
import { observer } from '@legendapp/state/react';
import { LegendList } from '@legendapp/list/react-native';
import { appState$, appActions } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';

const AnimatedTypography = Animated.createAnimatedComponent(Typography);

const HabitItem = observer(({ habitId }: { habitId: string }) => {
  const item$ = appState$.habits.find((h) => h.id.get() === habitId);
  if (!item$) return null;

  const title = item$.title.get();
  const isCompleted = item$.completed.get();
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
                ⚠️ SLIPPING! Neglected yesterday.
              </Typography>
            )}
          </View>
        </View>
      </BrutalistCard>
  );
});

export const HabitsScreen = observer(function HabitsScreen() {
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const habits = appState$.habits.get();

  const handleAddHabit = () => {
    if (newHabitTitle.trim()) {
      appActions.addHabit(newHabitTitle);
      setNewHabitTitle('');
    }
  };



  // Stable ID array
  const habitIds = React.useMemo(
    () => habits.map((h) => h.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [habits.length]
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
          THE ENGINE
        </Typography>
        <Typography variant="mono" style={styles.subtitle}>
          HABITS // STREAK STABILITY CHECKLIST
        </Typography>
      </View>

      {/* Add Habit input inline card */}
      <BrutalistCard backgroundColor="#FFFFFF">
        <View style={styles.addInputRow}>
          <TextInput
            style={styles.input}
            placeholder="NEW HABIT INSTRUCTION..."
            placeholderTextColor="#888888"
            value={newHabitTitle}
            onChangeText={setNewHabitTitle}
          />
          <BrutalistButton
            onPress={handleAddHabit}
            backgroundColor={BRUTALIST_THEME.colors.warning}
            style={styles.addButton}
            size="sm"
          >
            ADD
          </BrutalistButton>
        </View>
      </BrutalistCard>

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
  addInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: BRUTALIST_THEME.fonts.mono,
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    alignSelf: 'auto',
    minWidth: 80,
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
