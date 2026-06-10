import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { observer } from '@legendapp/state/react';
import { LegendList } from '@legendapp/list/react-native';
import { appState$, appActions } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';

const HabitItem = observer(({ habitId }: { habitId: string }) => {
  const item$ = appState$.habits.find((h) => h.id.get() === habitId);
  if (!item$) return null;

  const title = item$.title.get();
  const isCompleted = item$.completed.get();
  const isNeglected = item$.neglected.get() && !isCompleted;

  return (
    <Pressable onPress={() => appActions.toggleHabit(habitId)}>
      <BrutalistCard
        accentColor={isCompleted ? BRUTALIST_THEME.colors.success : undefined}
        neglected={isNeglected}
        style={styles.cardSpacing}
      >
        <View style={styles.itemRow}>
          {/* Custom styled checkbox indicator */}
          <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
            {isCompleted && (
              <Typography variant="bodyBold" color="#000000" style={styles.checkboxTick}>
                ✓
              </Typography>
            )}
          </View>
          
          <View style={styles.textContainer}>
            <Typography
              variant="bodyBold"
              color={isCompleted ? '#000000' : isNeglected ? '#FFFFFF' : BRUTALIST_THEME.colors.text}
              style={[
                isCompleted && styles.strikeThrough,
              ]}
            >
              {title}
            </Typography>
            
            {isNeglected && (
              <Typography variant="caption" style={{ color: '#FFD2D2', marginTop: 2 }}>
                ⚠️ SLIPPING! Neglected yesterday.
              </Typography>
            )}
          </View>
        </View>
      </BrutalistCard>
    </Pressable>
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
    width: 70,
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
  strikeThrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    opacity: 0.75,
  },
});
