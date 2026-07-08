import React, { useState, useMemo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Typography } from '@/ui/Typography';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { useUnistyles } from 'react-native-unistyles';
import {
  ONBOARDING_HABIT_OPTIONS,
  ONBOARDING_HABIT_CATEGORIES,
  OnboardingHabitOption,
} from '@/state/hardcoded-data/onboarding-habits';
import { triggerHaptic } from '@/ui/haptics';
import { styles } from './styles';

interface HabitPickerSlideProps {
  activeIndex: SharedValue<number>;
  selectedKeys: string[];
  onToggleHabit: (key: string) => void;
  customHabits: { title: string; emoji: string }[];
  onAddCustomHabit: (title: string, emoji: string) => void;
  onRemoveCustomHabit: (index: number) => void;
}

export function HabitPickerSlide({
  activeIndex,
  selectedKeys,
  onToggleHabit,
  customHabits,
  onAddCustomHabit,
  onRemoveCustomHabit,
}: HabitPickerSlideProps) {
  const { theme } = useUnistyles();
  const [customTitle, setCustomTitle] = useState('');
  const [customEmoji, setCustomEmoji] = useState('✨');

  const totalSelected = selectedKeys.length + customHabits.length;
  const isReady = totalSelected >= 3;

  const groupedHabits = useMemo(() => {
    const groups: Record<string, OnboardingHabitOption[]> = {};
    for (const cat of ONBOARDING_HABIT_CATEGORIES) {
      groups[cat] = ONBOARDING_HABIT_OPTIONS.filter((h) => h.category === cat);
    }
    return groups;
  }, []);

  const handleAddCustom = () => {
    if (customTitle.trim()) {
      triggerHaptic('success');
      onAddCustomHabit(customTitle.trim(), customEmoji);
      setCustomTitle('');
      setCustomEmoji('✨');
    }
  };

  const CUSTOM_EMOJIS = ['✨', '🎯', '📚', '🏃', '🎨', '🔧', '💡', '🌱'];

  return (
    <ScrollView
      style={styles.habitPickerScroll}
      contentContainerStyle={styles.habitPickerContent}
      showsVerticalScrollIndicator={false}
    >
      <Typography variant="h2" style={styles.slideTitle}>
        PICK YOUR HABITS
      </Typography>
      <Typography variant="body" style={styles.slideDescription}>
        Choose at least 3 habits to start building. You can always add more later.
      </Typography>

      {/* Counter Badge */}
      <View style={[styles.habitCounterContainer, isReady && styles.habitCounterReady]}>
        <Typography variant="mono" style={{ fontSize: 12, fontWeight: 'bold' }}>
          {totalSelected}/3 SELECTED {isReady ? '✓' : ''}
        </Typography>
      </View>

      {/* Category Groups */}
      {ONBOARDING_HABIT_CATEGORIES.map((category) => (
        <View key={category} style={styles.categorySection}>
          <Typography variant="mono" style={styles.categoryLabel}>
            {category}
          </Typography>
          <View style={styles.habitChipsGrid}>
            {groupedHabits[category].map((habit) => {
              const isSelected = selectedKeys.includes(habit.key);
              return (
                <Pressable
                  key={habit.key}
                  onPress={() => {
                    triggerHaptic('selection');
                    onToggleHabit(habit.key);
                  }}
                  style={[
                    styles.habitChip,
                    isSelected && [styles.habitChipSelected, { borderColor: theme.colors.border }],
                  ]}
                >
                  <Typography style={styles.habitChipEmoji}>{habit.emoji}</Typography>
                  <Typography variant="mono" style={styles.habitChipTitle}>
                    {habit.title}
                  </Typography>
                  {isSelected && (
                    <Typography style={styles.habitChipCheck}>✓</Typography>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      {/* Custom Habit */}
      <View style={styles.customHabitSection}>
        <Typography variant="bodyBold" style={styles.sectionLabel} uppercase>
          OR CREATE YOUR OWN
        </Typography>

        {/* Custom emoji picker */}
        <View style={[styles.avatarGrid, { marginBottom: 8 }]}>
          {CUSTOM_EMOJIS.map((emoji) => (
            <Pressable
              key={emoji}
              onPress={() => {
                triggerHaptic('selection');
                setCustomEmoji(emoji);
              }}
              style={[
                styles.avatarChip,
                { width: 40, height: 40 },
                customEmoji === emoji && styles.avatarChipSelected,
              ]}
            >
              <Typography style={{ fontSize: 18 }}>{emoji}</Typography>
            </Pressable>
          ))}
        </View>

        <View style={styles.customHabitRow}>
          <View style={styles.customHabitInput}>
            <BrutalistInput
              value={customTitle}
              onChangeText={setCustomTitle}
              placeholder="e.g. NO SUGAR..."
              autoCapitalize="characters"
              maxLength={30}
            />
          </View>
          <BrutalistButton
            onPress={handleAddCustom}
            backgroundColor={theme.colors.warning}
            size="sm"
            disabled={!customTitle.trim()}
          >
            + ADD
          </BrutalistButton>
        </View>

        {/* Added custom habits */}
        {customHabits.map((habit, index) => (
          <Animated.View key={`custom-${index}`} entering={FadeIn.duration(200)}>
            <Pressable
              onPress={() => {
                triggerHaptic('light');
                onRemoveCustomHabit(index);
              }}
              style={styles.addedCustomChip}
            >
              <Typography style={styles.habitChipEmoji}>{habit.emoji}</Typography>
              <Typography variant="mono" style={styles.habitChipTitle}>
                {habit.title.toUpperCase()}
              </Typography>
              <Typography style={[styles.habitChipCheck, { color: theme.colors.danger }]}>
                ✕
              </Typography>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}
