import { VoxelTower } from '@/components/ui/VoxelTower';
import { appActions, habitTemplates$, todayLog$ } from '@/state/store';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { ConfettiOverlay } from '@/ui/ConfettiOverlay';
import { Typography } from '@/ui/Typography';
import { getDayName, getMonthShortName, isHabitActiveOnDate } from '@/utils/date';
import { observer } from '@legendapp/state/react';
import React from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const PREDEFINED_CATEGORIES = [
  { name: 'HEALTH', emoji: '💪', color: '#4ADE80' },
  { name: 'WORK', emoji: '💼', color: '#FB923C' },
  { name: 'LEARNING', emoji: '📚', color: '#38BDF8' },
  { name: 'MINDFULNESS', emoji: '🧘', color: '#E879F9' },
  { name: 'FITNESS', emoji: '🏃', color: '#FBBF24' },
  { name: 'CREATIVE', emoji: '🎨', color: '#A78BFA' },
  { name: 'FINANCE', emoji: '💰', color: '#F472B6' },
  { name: 'OTHER', emoji: '⚡', color: '#94A3B8' },
];

const getCategoryDisplay = (name: string) => {
  const predefined = PREDEFINED_CATEGORIES.find(c => c.name === name.toUpperCase());
  return predefined ? `${predefined.emoji} ${name.toUpperCase()}` : name.toUpperCase();
};

const HabitItem = observer(
  ({
    habitId,
    onComplete,
    onAddNote,
  }: {
    habitId: string;
    onComplete?: () => void;
    onAddNote?: (id: string) => void;
  }) => {
    const log = todayLog$.get();
    const swipeableRef = React.useRef<Swipeable>(null);

    if (!log) return null;

    const entryIndex = log.entries.findIndex((e) => e.habitId === habitId);
    if (entryIndex === -1) return null;

    const title = todayLog$.entries[entryIndex].title.get();
    const emoji = todayLog$.entries[entryIndex].emoji.get();
    const isCompleted = todayLog$.entries[entryIndex].completed.get();
    const note = todayLog$.entries[entryIndex].note.get();

    // neglected status only depends on yesterday, and is cleared when completed today
    const isNeglected = React.useMemo(
      () => appActions.isHabitNeglected(habitId) && !isCompleted,
      [habitId, isCompleted],
    );

    const { theme } = useUnistyles();

    const renderRightActions = React.useCallback(() => {
      return (
        <View style={styles.swipeActionContainer}>
          <TouchableOpacity
            style={styles.swipeActionButton}
            onPress={() => {
              swipeableRef.current?.close();
              onAddNote?.(habitId);
            }}
          >
            <Typography
              variant="caption"
              style={{ color: theme.colors.background, fontWeight: 'bold' }}
            >
              NOTES
            </Typography>
          </TouchableOpacity>
        </View>
      );
    }, [habitId, onAddNote, theme]);

    // Reanimated styles
    const textAnimatedStyle = useAnimatedStyle(() => {
      return {
        color: withTiming(isCompleted ? '#000000' : isNeglected ? '#FFFFFF' : theme.colors.text, {
          duration: 200,
        }),
        opacity: withTiming(isCompleted ? 0.75 : 1, { duration: 200 }),
      };
    }, [isCompleted, isNeglected, theme.colors.text]);

    const strikeAnimatedStyle = useAnimatedStyle(() => {
      return {
        width: withTiming(isCompleted ? '100%' : '0%', { duration: 300 }),
        backgroundColor: withTiming(
          isCompleted ? '#000000' : isNeglected ? '#FFFFFF' : theme.colors.text,
          { duration: 200 },
        ),
      };
    }, [isCompleted, isNeglected, theme.colors.text]);

    const tickAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(isCompleted ? 1 : 0, { duration: 200 }),
        transform: [{ scale: withSpring(isCompleted ? 1 : 0.5) }],
      };
    }, [isCompleted]);

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        containerStyle={styles.cardSpacing}
      >
        <BrutalistCard
          accentColor={isCompleted ? theme.colors.success : undefined}
          neglected={isNeglected}
          style={{ marginVertical: 0 }}
          onPress={() => {
            const wasCompleted = appActions.isAllCompletedToday();
            appActions.toggleHabit(habitId);
            if (!wasCompleted && appActions.isAllCompletedToday()) {
              onComplete?.();
            }
          }}
        >
          <View style={styles.itemRow}>
            {/* Custom styled checkbox indicator */}
            <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
              <Animated.View style={tickAnimatedStyle}>
                <Typography
                  variant="bodyBold"
                  color={isCompleted ? theme.colors.background : theme.colors.text}
                  style={styles.checkboxTick}
                >
                  ✓
                </Typography>
              </Animated.View>
            </View>
            <View style={styles.emojiSquare}>
              <Typography style={styles.emojiText}>{emoji || '⚡'}</Typography>
            </View>

            <View style={styles.textContainer}>
              <View style={{ alignSelf: 'flex-start' }}>
                <Animated.Text
                  style={[
                    styles.habitTitleText,
                    textAnimatedStyle,
                  ]}
                >
                  {title}
                </Animated.Text>
                {/* Custom Animated Strikethrough Line */}
                <Animated.View style={[styles.customStrike, strikeAnimatedStyle]} />
              </View>

              {isNeglected && (
                <Typography variant="caption" style={{ color: '#FFD2D2', marginTop: 2 }}>
                  ⚠️ You missed this yesterday.
                </Typography>
              )}
              {note ? (
                <TouchableOpacity
                  style={{ marginTop: 4, paddingVertical: 4 }}
                  onPress={(e) => {
                    e.stopPropagation();
                    onAddNote?.(habitId);
                  }}
                >
                  <Typography variant="caption" style={{ color: theme.colors.textMuted }}>
                    📝 {note}
                  </Typography>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </BrutalistCard>
      </Swipeable>
    );
  },
);

export const HabitsScreen = observer(function HabitsScreen() {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [selectedHabitForNote, setSelectedHabitForNote] = React.useState<string | null>(null);
  const [draftNote, setDraftNote] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [collapsedCategories, setCollapsedCategories] = React.useState<Record<string, boolean>>({});
  const log = todayLog$.get();

  const rawTemplates = habitTemplates$.get();
  const templates = React.useMemo(() => rawTemplates || [], [rawTemplates]);
  const activeToday = React.useMemo(() => {
    return templates.filter((t) => t && isHabitActiveOnDate(t, new Date()) && !t.archivedAt);
  }, [templates]);

  const groupedEntries = React.useMemo(() => {
    if (!log) return [];
    
    const groups: Record<string, {
      category: string;
      color: string;
      entries: typeof log.entries;
    }> = {};
    
    log.entries.forEach((entry) => {
      const template = templates.find((t) => t && t.id === entry.habitId);
      const category = template?.category || 'UNCATEGORIZED';
      const color = template?.categoryColor || '#94A3B8';
      
      if (!groups[category]) {
        groups[category] = {
          category,
          color,
          entries: [],
        };
      }
      groups[category].entries.push(entry);
    });
    
    return Object.values(groups).sort((a, b) => {
      if (a.category === 'UNCATEGORIZED') return 1;
      if (b.category === 'UNCATEGORIZED') return -1;
      return a.category.localeCompare(b.category);
    });
  }, [log, templates]);

  const todayStr = React.useMemo(() => {
    const today = new Date();
    return `${getDayName(today)} // ${getMonthShortName(today)} ${today.getDate()}`;
  }, []);

  const handleOpenNoteSheet = React.useCallback((habitId: string) => {
    const log = todayLog$.get();
    const entry = log?.entries.find((e) => e.habitId === habitId);
    setDraftNote(entry?.note || '');
    setSelectedHabitForNote(habitId);
  }, []);

  const handleSaveNote = () => {
    if (selectedHabitForNote) {
      appActions.addHabitNote(selectedHabitForNote, draftNote.trim());
      setSelectedHabitForNote(null);
    }
  };

  const { theme } = useUnistyles();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    appActions.loadTodayLog();
    appActions.generateDailyLogIfMissing();
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  return (
    <View style={styles.container}>
      <ConfettiOverlay isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      {/* Title block */}
      <View style={styles.header}>
        <Typography variant="h2" uppercase>
          HABITS
        </Typography>
        <Typography variant="mono" style={styles.subtitle}>
          YOUR DAILY HABITS
        </Typography>
      </View>

      <VoxelTower />

      {!log ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <BrutalistCard style={styles.emptyCard} backgroundColor={theme.colors.background}>
            <View style={styles.emptyCardContent}>
              {/* Sticker Badge */}
              <View style={styles.badgeContainer}>
                <Typography style={styles.badgeEmoji}>🧱</Typography>
              </View>

              {/* Date Tag */}
              <View style={styles.dateTag}>
                <Typography variant="mono" style={styles.dateTagText}>
                  {todayStr}
                </Typography>
              </View>

              <Typography variant="h3" uppercase style={styles.cardTitle}>
                A New Day Begins
              </Typography>
              <Typography variant="body" style={styles.cardDescription}>
                Ready to crush your goals today? Pull your latest habits and start tracking.
              </Typography>

              {/* Habit Preview Section */}
              <View style={styles.previewSection}>
                <Typography variant="mono" style={styles.previewTitle}>
                  {activeToday.length > 0
                    ? `TODAY'S BUILD LIST (${activeToday.length})`
                    : 'NO HABITS SCHEDULED'}
                </Typography>

                {activeToday.length > 0 ? (
                  <View style={styles.previewGrid}>
                    {activeToday.map((habit) => (
                      <View key={habit.id} style={styles.habitBadge}>
                        <Typography variant="caption" style={styles.habitBadgeBullet}>
                          {habit.emoji || '⚡'}
                        </Typography>
                        <Typography variant="mono" style={styles.habitBadgeText} numberOfLines={1}>
                          {habit.title}
                        </Typography>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Typography variant="body" style={styles.noHabitsText}>
                    {"You don't have any habits scheduled for today. Add templates in settings or manage them!"}
                  </Typography>
                )}
              </View>

              <BrutalistButton
                onPress={() => appActions.generateDailyLogIfMissing()}
                backgroundColor={theme.colors.success}
                style={styles.startBtn}
                size="lg"
              >
                START DAY ➔
              </BrutalistButton>
            </View>
          </BrutalistCard>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.text}
              colors={[theme.colors.text]}
            />
          }
        >
          {groupedEntries.map((group) => {
            const isCollapsed = !!collapsedCategories[group.category];
            const completedCount = group.entries.filter((e) => e.completed).length;
            const totalCount = group.entries.length;

            return (
              <View key={group.category} style={styles.categorySection}>
                <BrutalistCard
                  backgroundColor={group.color}
                  style={styles.categoryHeaderCard}
                  onPress={() => {
                    setCollapsedCategories((prev) => ({
                      ...prev,
                      [group.category]: !prev[group.category],
                    }));
                  }}
                >
                  <View style={styles.categoryHeaderRow}>
                    <Typography variant="bodyBold" style={styles.categoryHeaderText}>
                      {getCategoryDisplay(group.category)}
                    </Typography>
                    <View style={styles.categoryHeaderRight}>
                      <Typography variant="mono" style={styles.categoryCount}>
                        {completedCount}/{totalCount} DONE
                      </Typography>
                      <Typography variant="mono" style={styles.collapseIcon}>
                        {isCollapsed ? '[ + ]' : '[ - ]'}
                      </Typography>
                    </View>
                  </View>
                </BrutalistCard>

                {!isCollapsed && (
                  <View style={styles.categoryHabitsContainer}>
                    {group.entries.map((entry) => (
                      <HabitItem
                        key={entry.habitId}
                        habitId={entry.habitId}
                        onComplete={() => setShowConfetti(true)}
                        onAddNote={handleOpenNoteSheet}
                      />
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      <BrutalistBottomSheet
        visible={!!selectedHabitForNote}
        onClose={() => setSelectedHabitForNote(null)}
        title="HABIT NOTE"
      >
        <View style={{ marginBottom: 24 }}>
          <BrutalistInput
            multiline
            placeholder="Add some details..."
            value={draftNote}
            onChangeText={setDraftNote}
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />
          <BrutalistButton
            onPress={handleSaveNote}
            backgroundColor={theme.colors.success}
            style={{ marginTop: 16 }}
          >
            SAVE NOTE
          </BrutalistButton>
        </View>
      </BrutalistBottomSheet>
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: theme.colors.background,
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  list: {
    flex: 1,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 100, // Extra space to clear tab bar
  },
  swipeActionContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingLeft: 8,
    paddingBottom: 4, // Align with card shadow offset
  },
  swipeActionButton: {
    flex: 1,
    backgroundColor: theme.colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
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
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.border,
  },
  checkboxTick: {
    fontSize: 14,
    lineHeight: 18,
  },
  emojiSquare: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 14,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  habitTitleText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  customStrike: {
    position: 'absolute',
    top: '50%',
    left: 0,
    height: 2,
    backgroundColor: theme.colors.text,
    marginTop: -1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  // Beautified Start Day Card styles
  emptyCard: {
    marginTop: 24,
  },
  emptyCardContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  badgeContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.warning,
    borderWidth: 3,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  badgeEmoji: {
    fontSize: 32,
    lineHeight: 38,
  },
  dateTag: {
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  dateTagText: {
    color: theme.colors.background,
    fontSize: 10,
    fontFamily: theme.fonts.mono,
    letterSpacing: 1,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 20,
  },
  cardDescription: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    marginBottom: 24,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  previewSection: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.paper,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 4,
    padding: 12,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 10,
    fontFamily: theme.fonts.heading,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  habitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: theme.colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  habitBadgeBullet: {
    fontSize: 10,
    marginRight: 4,
  },
  habitBadgeText: {
    fontSize: 9,
    fontFamily: theme.fonts.mono,
    fontWeight: 'bold',
  },
  noHabitsText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  startBtn: {
    marginTop: 8,
    minWidth: 220,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryHeaderCard: {
    marginVertical: 4,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryHeaderText: {
    fontSize: 15,
    color: '#000000',
    fontWeight: 'bold',
  },
  categoryHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryCount: {
    fontSize: 11,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: theme.fonts.mono,
  },
  collapseIcon: {
    fontSize: 11,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: theme.fonts.mono,
  },
  categoryHabitsContainer: {
    marginTop: 4,
  },
}));
