import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { observer } from '@legendapp/state/react';
import { habitsState$ } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { PressableScale } from 'pressto';
import { triggerHaptic } from '@/ui/haptics';
import {
  getLocalDateString,
  isHabitActiveOnDate,
  getDayCompletionStats,
  getWeekDates,
  getMonthGrid,
  isSameDay,
  getDayName,
  getMonthShortName,
  getMonthFullName,
} from '@/utils/date';

const AnimatedTypography = Animated.createAnimatedComponent(Typography);

// Read-only habit item for the bottom sheet detail view
const ReadOnlyHabitItem = observer(({ habitId, dateStr }: { habitId: string; dateStr: string }) => {
  const item$ = habitsState$.find((h) => h.id.get() === habitId);
  if (!item$) return null;

  const title = item$.title.get();
  const completedDates = item$.completedDates.get() || [];
  const isCompleted = completedDates.includes(dateStr);
  const todayStr = getLocalDateString();
  const isPast = dateStr < todayStr;
  const isNeglected = !isCompleted && isPast;

  const textAnimatedStyle = useAnimatedStyle(() => ({
    color: withTiming(
      isCompleted ? '#000000' : isNeglected ? '#FFFFFF' : BRUTALIST_THEME.colors.text,
      { duration: 200 }
    ),
    opacity: withTiming(isCompleted ? 0.75 : 1, { duration: 200 }),
  }), [isCompleted, isNeglected]);

  const strikeAnimatedStyle = useAnimatedStyle(() => ({
    width: withTiming(isCompleted ? '100%' : '0%', { duration: 300 }),
  }), [isCompleted]);

  const tickAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isCompleted ? 1 : 0, { duration: 200 }),
    transform: [{ scale: withSpring(isCompleted ? 1 : 0.5) }],
  }), [isCompleted]);

  return (
    <BrutalistCard
      accentColor={isCompleted ? BRUTALIST_THEME.colors.success : undefined}
      neglected={isNeglected}
      style={styles.cardSpacing}
    >
      <View style={styles.itemRow}>
        <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
          <Animated.View style={tickAnimatedStyle}>
            <Typography variant="bodyBold" color="#000000" style={styles.checkboxTick}>
              ✓
            </Typography>
          </Animated.View>
        </View>
        <View style={styles.textContainer}>
          <View style={{ alignSelf: 'flex-start' }}>
            <AnimatedTypography variant="bodyBold" style={[textAnimatedStyle]}>
              {title}
            </AnimatedTypography>
            <Animated.View style={[styles.customStrike, strikeAnimatedStyle]} />
          </View>
          {isNeglected && (
            <Typography variant="caption" style={{ color: '#FFEEEE', marginTop: 2 }}>
              ✕ Missed
            </Typography>
          )}
        </View>
      </View>
    </BrutalistCard>
  );
});

export const AnalyticsScreen = observer(function AnalyticsScreen() {
  const habits = habitsState$.get();

  // View modes: 'week' | 'month'
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // Bottom Sheet
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Navigation anchors
  const [weekAnchorDate, setWeekAnchorDate] = useState<Date>(new Date());
  const [monthAnchorDate, setMonthAnchorDate] = useState<Date>(new Date());

  // Week cells
  const weekCells = React.useMemo(() => {
    const cells = getWeekDates(weekAnchorDate);
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return cells.map(cell => ({
      ...cell,
      dayName: dayNames[cell.date.getDay()],
    }));
  }, [weekAnchorDate]);

  // Month cells
  const monthCells = React.useMemo(() => getMonthGrid(monthAnchorDate), [monthAnchorDate]);

  const handlePrevWeek = () => {
    triggerHaptic('light');
    const d = new Date(weekAnchorDate);
    d.setDate(d.getDate() - 7);
    setWeekAnchorDate(d);
  };
  const handleNextWeek = () => {
    triggerHaptic('light');
    const d = new Date(weekAnchorDate);
    d.setDate(d.getDate() + 7);
    setWeekAnchorDate(d);
  };
  const handlePrevMonth = () => {
    triggerHaptic('light');
    const d = new Date(monthAnchorDate);
    d.setMonth(d.getMonth() - 1);
    setMonthAnchorDate(d);
  };
  const handleNextMonth = () => {
    triggerHaptic('light');
    const d = new Date(monthAnchorDate);
    d.setMonth(d.getMonth() + 1);
    setMonthAnchorDate(d);
  };

  const handleOpenDayHistory = (date: Date) => {
    setSelectedDate(date);
    triggerHaptic('selection');
    setIsSheetVisible(true);
  };

  const selectedDateString = getLocalDateString(selectedDate);

  const activeHabitsForSelectedDate = React.useMemo(
    () => habits.filter(h => isHabitActiveOnDate(h, selectedDate)),
    [habits, selectedDate]
  );

  const completedCountForSelectedDate = React.useMemo(
    () => activeHabitsForSelectedDate.filter(h => h.completedDates?.includes(selectedDateString)).length,
    [activeHabitsForSelectedDate, selectedDateString]
  );

  // ── Switcher ──
  const renderSwitcher = () => (
    <View style={styles.switcherContainer}>
      {(['week', 'month'] as const).map((mode) => {
        const isActive = viewMode === mode;
        return (
          <PressableScale
            key={mode}
            onPress={() => {
              triggerHaptic('selection');
              setViewMode(mode);
            }}
            style={[
              styles.switcherButton,
              isActive && styles.switcherButtonActive,
              mode === 'month' && styles.switcherButtonSeparator,
            ]}
            // @ts-ignore
            activeScale={0.96}
          >
            <Typography
              variant="bodyBold"
              style={[styles.switcherText, isActive && styles.switcherTextActive]}
            >
              {mode.toUpperCase()}
            </Typography>
          </PressableScale>
        );
      })}
    </View>
  );

  // ── Week View ──
  const renderWeekView = () => {
    const firstDay = weekCells[0]?.date;
    const lastDay = weekCells[6]?.date;
    const rangeLabel = firstDay && lastDay
      ? `${getMonthShortName(firstDay)} ${firstDay.getDate()} – ${getMonthShortName(lastDay)} ${lastDay.getDate()}, ${lastDay.getFullYear()}`
      : 'WEEK VIEW';

    return (
      <View style={styles.viewSection}>
        {/* Nav */}
        <View style={styles.navHeader}>
          {/* @ts-ignore */}
          <PressableScale onPress={handlePrevWeek} style={styles.navButton} activeScale={0.9}>
            <Typography variant="bodyBold">◀</Typography>
          </PressableScale>
          <Typography variant="bodyBold" style={styles.navLabel}>{rangeLabel}</Typography>
          {/* @ts-ignore */}
          <PressableScale onPress={handleNextWeek} style={styles.navButton} activeScale={0.9}>
            <Typography variant="bodyBold">▶</Typography>
          </PressableScale>
        </View>

        {/* Day strip */}
        <View style={styles.weekStrip}>
          {weekCells.map((cell, idx) => {
            const isToday = isSameDay(cell.date, new Date());
            const { totalCount, ratio } = getDayCompletionStats(habits, cell.date);
            let bottomBarColor = 'transparent';
            if (totalCount > 0) {
              bottomBarColor = ratio === 1
                ? BRUTALIST_THEME.colors.success
                : ratio > 0 ? BRUTALIST_THEME.colors.warning : BRUTALIST_THEME.colors.danger;
            }
            return (
              <PressableScale
                key={cell.dateString}
                onPress={() => handleOpenDayHistory(cell.date)}
                style={[styles.weekDayCell, isToday && styles.weekDayCellToday, idx === 6 && { borderRightWidth: 0 }]}
                // @ts-ignore
                activeScale={0.93}
              >
                <Typography variant="caption" style={styles.weekDayLabel}>{cell.dayName.substring(0, 1)}</Typography>
                <Typography variant="bodyBold" style={styles.weekDateLabel}>{cell.dayNumber}</Typography>
                {totalCount > 0 && <View style={[styles.weekStatusIndicator, { backgroundColor: bottomBarColor }]} />}
              </PressableScale>
            );
          })}
        </View>

        <Typography variant="caption" style={styles.infoText}>💡 Tap a day to see its habit list.</Typography>

        {/* Weekly bar chart */}
        <View style={styles.chartContainer}>
          <Typography variant="bodyBold" uppercase style={styles.chartTitle}>Completion Rates</Typography>
          <View style={styles.chartRow}>
            {weekCells.map((cell) => {
              const { totalCount, ratio } = getDayCompletionStats(habits, cell.date);
              const percentage = Math.round(ratio * 100);
              let barColor: string = BRUTALIST_THEME.colors.paper;
              if (totalCount > 0) {
                barColor = ratio === 1
                  ? BRUTALIST_THEME.colors.success
                  : ratio > 0 ? BRUTALIST_THEME.colors.warning : BRUTALIST_THEME.colors.danger;
              }
              const barHeight = totalCount > 0 ? Math.max(10, ratio * 90) : 4;
              return (
                <PressableScale
                  key={cell.dateString}
                  onPress={() => handleOpenDayHistory(cell.date)}
                  style={styles.chartBarWrapper}
                  // @ts-ignore
                  activeScale={0.93}
                >
                  {totalCount > 0 && (
                    <Typography variant="mono" style={styles.chartPercentageText}>{percentage}%</Typography>
                  )}
                  <View style={[styles.chartBar, { height: barHeight, backgroundColor: barColor }]} />
                  <Typography variant="mono" style={styles.chartBarLabel}>{cell.dayName.substring(0, 1)}</Typography>
                </PressableScale>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  // ── Month View ──
  const renderMonthView = () => {
    const monthLabel = `${getMonthFullName(monthAnchorDate)} ${monthAnchorDate.getFullYear()}`;
    const monthDays = monthCells.filter(c => c.isCurrentMonth).map(c => c.date);

    const habitBreakdown = habits.map(habit => {
      const scheduledDays = monthDays.filter(date => isHabitActiveOnDate(habit, date));
      const scheduledDatesStr = scheduledDays.map(d => getLocalDateString(d));
      const completedDates = habit.completedDates || [];
      const completedDaysCount = completedDates.filter(d => scheduledDatesStr.includes(d)).length;
      return {
        habit,
        scheduledCount: scheduledDays.length,
        completedCount: completedDaysCount,
        rate: scheduledDays.length > 0 ? completedDaysCount / scheduledDays.length : 0,
      };
    });

    return (
      <View style={styles.viewSection}>
        {/* Nav */}
        <View style={styles.navHeader}>
          {/* @ts-ignore */}
          <PressableScale onPress={handlePrevMonth} style={styles.navButton} activeScale={0.9}>
            <Typography variant="bodyBold">◀</Typography>
          </PressableScale>
          <Typography variant="bodyBold" style={styles.navLabel}>{monthLabel}</Typography>
          {/* @ts-ignore */}
          <PressableScale onPress={handleNextMonth} style={styles.navButton} activeScale={0.9}>
            <Typography variant="bodyBold">▶</Typography>
          </PressableScale>
        </View>

        {/* Weekday headers */}
        <View style={styles.calendarHeaderRow}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
            <View key={idx} style={styles.calendarHeaderCell}>
              <Typography variant="caption" style={styles.calendarHeaderCellText}>{day}</Typography>
            </View>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.calendarGrid}>
          {monthCells.map((cell, idx) => {
            const isToday = isSameDay(cell.date, new Date());
            const { totalCount, ratio } = getDayCompletionStats(habits, cell.date);
            let cellBg: string = BRUTALIST_THEME.colors.paper;
            let cellOpacity = 1;
            if (!cell.isCurrentMonth) {
              cellBg = '#EAEAEA';
              cellOpacity = 0.4;
            } else if (totalCount > 0) {
              if (ratio === 1) cellBg = BRUTALIST_THEME.colors.success;
              else if (ratio > 0) cellBg = BRUTALIST_THEME.colors.warning;
              else if (cell.date <= new Date()) cellBg = '#FCA5A5';
            }
            return (
              <PressableScale
                key={`${cell.dateString}-${idx}`}
                onPress={() => { if (cell.isCurrentMonth) handleOpenDayHistory(cell.date); }}
                style={[
                  styles.calendarCell,
                  { backgroundColor: cellBg, opacity: cellOpacity },
                  isToday && styles.calendarCellToday,
                ]}
                // @ts-ignore
                activeScale={0.9}
              >
                <Typography variant="mono" style={styles.calendarCellText}>{cell.dayNumber}</Typography>
              </PressableScale>
            );
          })}
        </View>

        <Typography variant="caption" style={styles.infoText}>💡 Tap a cell to see its habit list.</Typography>

        {/* Monthly breakdown */}
        <View style={styles.breakdownContainer}>
          <Typography variant="bodyBold" uppercase style={styles.chartTitle}>Habit Breakdown</Typography>
          {habitBreakdown.map(({ habit, scheduledCount, completedCount, rate }) => {
            const percentage = Math.round(rate * 100);
            let barColor: string = BRUTALIST_THEME.colors.paper;
            if (scheduledCount > 0) {
              barColor = rate === 1
                ? BRUTALIST_THEME.colors.success
                : rate > 0 ? BRUTALIST_THEME.colors.warning : BRUTALIST_THEME.colors.danger;
            }
            return (
              <View key={habit.id} style={styles.breakdownItem}>
                <View style={styles.breakdownTextRow}>
                  <Typography variant="bodyBold" style={styles.breakdownHabitTitle} numberOfLines={1}>
                    {habit.title}
                  </Typography>
                  <Typography variant="mono" style={styles.breakdownFraction}>
                    {completedCount}/{scheduledCount} D ({percentage}%)
                  </Typography>
                </View>
                <View style={styles.progressBarOuter}>
                  <View style={[styles.progressBarInner, { width: `${percentage}%`, backgroundColor: barColor }]} />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // ── Bottom Sheet Details ──
  const renderSelectedDayDetails = () => (
    <View style={styles.detailsSection}>
      {activeHabitsForSelectedDate.length > 0 && (
        <View style={styles.detailsStatRow}>
          <Typography variant="mono" style={styles.detailsSubtitle}>
            {completedCountForSelectedDate} / {activeHabitsForSelectedDate.length} HABITS COMPLETED
          </Typography>
        </View>
      )}
      {activeHabitsForSelectedDate.length === 0 ? (
        <BrutalistCard style={styles.emptyCard}>
          <Typography variant="bodyBold" style={styles.emptyText}>NO HABITS SCHEDULED</Typography>
        </BrutalistCard>
      ) : (
        activeHabitsForSelectedDate.map((habit) => (
          <ReadOnlyHabitItem key={habit.id} habitId={habit.id} dateStr={selectedDateString} />
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" uppercase>ANALYTICS</Typography>
        <Typography variant="mono" style={styles.subtitle}>YOUR HABIT PROGRESS</Typography>
      </View>

      {renderSwitcher()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === 'week' ? renderWeekView() : renderMonthView()}
      </ScrollView>

      <BrutalistBottomSheet
        visible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
        title={getDayName(selectedDate) + ', ' + getMonthShortName(selectedDate) + ' ' + selectedDate.getDate()}
      >
        {renderSelectedDayDetails()}
      </BrutalistBottomSheet>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  header: { marginBottom: 16 },
  subtitle: { fontSize: 10, color: BRUTALIST_THEME.colors.textMuted, marginTop: 4 },
  switcherContainer: {
    flexDirection: 'row',
    borderWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    overflow: 'hidden',
  },
  switcherButton: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#FFFFFF' },
  switcherButtonActive: { backgroundColor: BRUTALIST_THEME.colors.warning },
  switcherButtonSeparator: { borderLeftWidth: BRUTALIST_THEME.borderWidth, borderColor: BRUTALIST_THEME.colors.border },
  switcherText: { fontSize: 12, fontFamily: BRUTALIST_THEME.fonts.heading, color: BRUTALIST_THEME.colors.textMuted },
  switcherTextActive: { color: BRUTALIST_THEME.colors.text },
  scrollView: { flex: 1, marginTop: 8 },
  scrollViewContent: { paddingBottom: 120 },
  viewSection: { marginBottom: 20 },
  navHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navButton: {
    borderWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  navLabel: { fontSize: 13, fontFamily: BRUTALIST_THEME.fonts.mono, textAlign: 'center' },
  weekStrip: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderWidth: BRUTALIST_THEME.borderWidth, borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius, backgroundColor: '#FFFFFF', overflow: 'hidden',
  },
  weekDayCell: {
    flex: 1, aspectRatio: 0.8, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 6, borderRightWidth: 1.5, borderColor: BRUTALIST_THEME.colors.border, position: 'relative',
  },
  weekDayCellToday: { backgroundColor: '#FFFBEB' },
  weekDayLabel: { fontSize: 9, fontFamily: BRUTALIST_THEME.fonts.heading, color: BRUTALIST_THEME.colors.textMuted },
  weekDateLabel: { fontSize: 15, fontFamily: BRUTALIST_THEME.fonts.mono, fontWeight: 'bold', marginTop: 2 },
  weekStatusIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4 },
  infoText: { marginTop: 8, color: BRUTALIST_THEME.colors.textMuted, fontSize: 10, textAlign: 'center', fontStyle: 'italic' },
  chartContainer: {
    marginTop: 20, padding: 14,
    borderWidth: BRUTALIST_THEME.borderWidth, borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius, backgroundColor: '#FFFFFF',
  },
  chartTitle: { fontSize: 14, fontFamily: BRUTALIST_THEME.fonts.heading, marginBottom: 14, textAlign: 'center' },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, paddingBottom: 4 },
  chartBarWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  chartPercentageText: { fontSize: 8, color: BRUTALIST_THEME.colors.textMuted, marginBottom: 4 },
  chartBar: { width: 20, borderWidth: 2, borderColor: BRUTALIST_THEME.colors.border, borderRadius: 3, borderBottomWidth: 0 },
  chartBarLabel: { fontSize: 10, marginTop: 6, fontWeight: 'bold' },
  calendarHeaderRow: { flexDirection: 'row', marginBottom: 6 },
  calendarHeaderCell: { width: '14.285%', alignItems: 'center', justifyContent: 'center' },
  calendarHeaderCellText: { fontSize: 11, fontWeight: 'bold', color: BRUTALIST_THEME.colors.textMuted },
  calendarGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    borderWidth: BRUTALIST_THEME.borderWidth, borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius, backgroundColor: '#FFFFFF', overflow: 'hidden',
  },
  calendarCell: {
    width: '14.285%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center',
    borderWidth: 0.75, borderColor: BRUTALIST_THEME.colors.border,
  },
  calendarCellToday: { borderWidth: 2, borderColor: BRUTALIST_THEME.colors.warning },
  calendarCellText: { fontSize: 13 },
  breakdownContainer: {
    marginTop: 20, padding: 14,
    borderWidth: BRUTALIST_THEME.borderWidth, borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius, backgroundColor: '#FFFFFF',
  },
  breakdownItem: { marginBottom: 12 },
  breakdownTextRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  breakdownHabitTitle: { fontSize: 12, flex: 1, marginRight: 8 },
  breakdownFraction: { fontSize: 10, color: BRUTALIST_THEME.colors.textMuted },
  progressBarOuter: {
    height: 12, borderWidth: 1.5, borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius, backgroundColor: '#FFFFFF', overflow: 'hidden', marginTop: 4,
  },
  progressBarInner: { height: '100%' },
  detailsSection: { marginTop: 4, minHeight: 100 },
  detailsStatRow: { alignItems: 'center', marginBottom: 12 },
  detailsSubtitle: { fontSize: 11, color: BRUTALIST_THEME.colors.textMuted },
  cardSpacing: { marginVertical: 6 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: {
    width: 24, height: 24, borderWidth: 2.5, borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#FFFFFF' },
  checkboxTick: { fontSize: 14, lineHeight: 18 },
  textContainer: { flex: 1, justifyContent: 'center' },
  customStrike: { position: 'absolute', top: '50%', left: 0, height: 2, backgroundColor: '#000000', marginTop: -1 },
  emptyCard: { paddingVertical: 20, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: BRUTALIST_THEME.colors.textMuted, fontSize: 12, textAlign: 'center' },
});
