import { appActions, habitTemplates$, todayLog$ } from '@/state/store';
import { DailyHabitEntry } from '@/state/types';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { WeeklySummaryCard } from './WeeklySummaryCard';
import { triggerHaptic } from '@/ui/haptics';
import { Typography } from '@/ui/Typography';
import {
  getDayName,
  getLocalDateString,
  getMonthFullName,
  getMonthGrid,
  getMonthShortName,
  getWeekDates,
  isSameDay,
  getYearGrid,
  YearGridCell,
} from '@/utils/date';
import { observer } from '@legendapp/state/react';
import { PressableScale } from 'pressto';
import React, { useState, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const AnimatedTypography = Animated.createAnimatedComponent(Typography);

// Read-only habit item for the bottom sheet detail view
const ReadOnlyHabitItem = ({ entry, dateStr }: { entry: DailyHabitEntry; dateStr: string }) => {
  const title = entry.title;
  const isCompleted = entry.completed;
  const todayStr = getLocalDateString();
  const isPast = dateStr < todayStr;
  const isNeglected = !isCompleted && isPast;
  const note = entry.note;

  const { theme } = useUnistyles();

  const textAnimatedStyle = useAnimatedStyle(
    () => ({
      color: withTiming(isCompleted ? '#000000' : isNeglected ? '#FFFFFF' : theme.colors.text, {
        duration: 200,
      }),
      opacity: withTiming(isCompleted ? 0.75 : 1, { duration: 200 }),
    }),
    [isCompleted, isNeglected, theme.colors.text],
  );

  const strikeAnimatedStyle = useAnimatedStyle(
    () => ({
      width: withTiming(isCompleted ? '100%' : '0%', { duration: 300 }),
      backgroundColor: withTiming(
        isCompleted ? '#000000' : isNeglected ? '#FFFFFF' : theme.colors.text,
        { duration: 200 },
      ),
    }),
    [isCompleted, isNeglected, theme.colors.text],
  );

  const tickAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(isCompleted ? 1 : 0, { duration: 200 }),
      transform: [{ scale: withSpring(isCompleted ? 1 : 0.5) }],
    }),
    [isCompleted],
  );

  return (
    <BrutalistCard
      accentColor={isCompleted ? theme.colors.success : undefined}
      neglected={isNeglected}
      style={styles.cardSpacing}
    >
      <View style={styles.itemRow}>
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
          <Typography style={styles.emojiText}>{entry.emoji || '⚡'}</Typography>
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
          {note && (
            <Typography
              variant="caption"
              style={{ color: theme.colors.textMuted, marginTop: 4, fontFamily: theme.fonts.mono }}
            >
              📝 {note}
            </Typography>
          )}
        </View>
      </View>
    </BrutalistCard>
  );
};

export const AnalyticsScreen = observer(function AnalyticsScreen() {
  const habits = habitTemplates$.get() || [];
  const todayLog = todayLog$.get();
  const { theme } = useUnistyles();

  const insights = React.useMemo(() => {
    return appActions.generateInsights();
  }, [habits, todayLog]);

  // View modes: 'week' | 'month' | 'year'
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'year'>('week');

  const shareRef = useRef<ViewShot>(null);

  const handleShare = async () => {
    try {
      if (shareRef.current?.capture) {
        const uri = await shareRef.current.capture();
        await Sharing.shareAsync(uri);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Bottom Sheet
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Navigation anchors
  const [weekAnchorDate, setWeekAnchorDate] = useState<Date>(new Date());
  const [monthAnchorDate, setMonthAnchorDate] = useState<Date>(new Date());
  const [yearAnchorDate, setYearAnchorDate] = useState<Date>(new Date());

  // Week cells
  const weekCells = React.useMemo(() => {
    const cells = getWeekDates(weekAnchorDate);
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return cells.map((cell) => ({
      ...cell,
      dayName: dayNames[cell.date.getDay()],
    }));
  }, [weekAnchorDate]);

  // Month cells
  const monthCells = React.useMemo(() => getMonthGrid(monthAnchorDate), [monthAnchorDate]);

  // Year cells
  const yearCells = React.useMemo(() => getYearGrid(yearAnchorDate.getFullYear()), [yearAnchorDate]);

  const yearScrollRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    if (viewMode === 'year' && yearScrollRef.current) {
      const today = new Date();
      if (yearAnchorDate.getFullYear() === today.getFullYear()) {
        const todayCell = yearCells.find(c => isSameDay(c.date, today));
        if (todayCell) {
          const xOffset = Math.max(0, todayCell.weekIndex * 16 - 150); 
          setTimeout(() => {
            yearScrollRef.current?.scrollTo({ x: xOffset, animated: true });
          }, 100);
        }
      } else {
        setTimeout(() => {
          yearScrollRef.current?.scrollTo({ x: 0, animated: false });
        }, 100);
      }
    }
  }, [viewMode, yearAnchorDate, yearCells]);

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
  const handlePrevYear = () => {
    triggerHaptic('light');
    const d = new Date(yearAnchorDate);
    d.setFullYear(d.getFullYear() - 1);
    setYearAnchorDate(d);
  };
  const handleNextYear = () => {
    triggerHaptic('light');
    const d = new Date(yearAnchorDate);
    d.setFullYear(d.getFullYear() + 1);
    setYearAnchorDate(d);
  };

  const handleOpenDayHistory = (date: Date) => {
    setSelectedDate(date);
    triggerHaptic('selection');
    setIsSheetVisible(true);
  };

  const selectedDateString = getLocalDateString(selectedDate);
  const selectedDayStats = React.useMemo(
    () => appActions.getDayStats(selectedDateString),
    [selectedDateString, isSheetVisible],
  );

  // ── Switcher ──
  const renderSwitcher = () => (
    <View style={styles.switcherContainer}>
      {(['week', 'month', 'year'] as const).map((mode) => {
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
              mode !== 'week' && styles.switcherButtonSeparator,
            ]}
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

  // ── Insights Section ──
  const renderInsights = () => {
    if (insights.length === 0) return null;
    return (
      <View style={styles.insightsContainer}>
        <Typography variant="bodyBold" uppercase style={styles.chartTitle}>
          Insights
        </Typography>
        {insights.map((insight, idx) => (
          <BrutalistCard 
            key={idx} 
            style={styles.insightCard}
            accentColor={insight.type === 'positive' ? theme.colors.success : insight.type === 'warning' ? theme.colors.warning : undefined}
          >
            <View style={styles.insightRow}>
              <View style={styles.insightEmojiBox}>
                <Typography style={styles.insightEmoji}>{insight.emoji}</Typography>
              </View>
              <View style={styles.insightTextContent}>
                <Typography variant="bodyBold">{insight.title}</Typography>
                <Typography variant="mono" style={styles.insightDescription}>
                  {insight.description}
                </Typography>
              </View>
            </View>
          </BrutalistCard>
        ))}
      </View>
    );
  };

  // ── Week View ──
  const renderWeekView = () => {
    const firstDay = weekCells[0]?.date;
    const lastDay = weekCells[6]?.date;
    const rangeLabel =
      firstDay && lastDay
        ? `${getMonthShortName(firstDay)} ${firstDay.getDate()} – ${getMonthShortName(lastDay)} ${lastDay.getDate()}, ${lastDay.getFullYear()}`
        : 'WEEK VIEW';

    return (
      <View style={styles.viewSection}>
        {/* Nav */}
        <View style={styles.navHeader}>
          {/* @ts-ignore */}
          <PressableScale onPress={handlePrevWeek} style={styles.navButton}>
            <Typography variant="bodyBold" color={theme.colors.text}>
              ◀
            </Typography>
          </PressableScale>
          <Typography variant="bodyBold" style={styles.navLabel}>
            {rangeLabel}
          </Typography>
          {/* @ts-ignore */}
          <PressableScale onPress={handleNextWeek} style={styles.navButton}>
            <Typography variant="bodyBold" color={theme.colors.text}>
              ▶
            </Typography>
          </PressableScale>
        </View>

        {/* Day strip */}
        <View style={styles.weekStrip}>
          {weekCells.map((cell, idx) => {
            const isToday = isSameDay(cell.date, new Date());
            const { total, rate } = appActions.getDayStats(cell.dateString);
            let bottomBarColor = 'transparent';
            if (total > 0) {
              bottomBarColor =
                rate === 1
                  ? theme.colors.success
                  : rate > 0
                    ? theme.colors.warning
                    : theme.colors.danger;
            }
            return (
              <PressableScale
                key={cell.dateString}
                onPress={() => handleOpenDayHistory(cell.date)}
                style={[
                  styles.weekDayCell,
                  isToday && styles.weekDayCellToday,
                  idx === 6 && { borderRightWidth: 0 },
                ]}
              >
                <Typography variant="caption" style={styles.weekDayLabel}>
                  {cell.dayName.substring(0, 1)}
                </Typography>
                <Typography variant="bodyBold" style={styles.weekDateLabel}>
                  {cell.dayNumber}
                </Typography>
                {total > 0 && (
                  <View style={[styles.weekStatusIndicator, { backgroundColor: bottomBarColor }]} />
                )}
              </PressableScale>
            );
          })}
        </View>

        <Typography variant="caption" style={styles.infoText}>
          💡 Tap a day to see its habit list.
        </Typography>

        {/* Weekly bar chart */}
        <View style={styles.chartContainer}>
          <Typography variant="bodyBold" uppercase style={styles.chartTitle}>
            Completion Rates
          </Typography>
          <View style={styles.chartRow}>
            {weekCells.map((cell) => {
              const { total, rate } = appActions.getDayStats(cell.dateString);
              const percentage = Math.round(rate * 100);
              let barColor: string = theme.colors.paper;
              if (total > 0) {
                barColor =
                  rate === 1
                    ? theme.colors.success
                    : rate > 0
                      ? theme.colors.warning
                      : theme.colors.danger;
              }
              const barHeight = total > 0 ? Math.max(10, rate * 90) : 4;
              return (
                <PressableScale
                  key={cell.dateString}
                  onPress={() => handleOpenDayHistory(cell.date)}
                  style={styles.chartBarWrapper}
                >
                  {total > 0 && (
                    <Typography variant="mono" style={styles.chartPercentageText}>
                      {percentage}%
                    </Typography>
                  )}
                  <View
                    style={[styles.chartBar, { height: barHeight, backgroundColor: barColor }]}
                  />
                  <Typography variant="mono" style={styles.chartBarLabel}>
                    {cell.dayName.substring(0, 1)}
                  </Typography>
                </PressableScale>
              );
            })}
          </View>
        </View>

        <BrutalistButton
          onPress={handleShare}
          style={{ marginTop: 24 }}
        >
          SHARE WEEK
        </BrutalistButton>
        {renderInsights()}
      </View>
    );
  };

  // ── Month View ──
  const renderMonthView = () => {
    const monthLabel = `${getMonthFullName(monthAnchorDate)} ${monthAnchorDate.getFullYear()}`;
    const monthDays = monthCells
      .filter((c) => c.isCurrentMonth)
      .map((c) => getLocalDateString(c.date));

    const habitBreakdown = habits
      .map((habit) => {
        const history = appActions.getHabitHistory(habit.id, monthDays);
        const scheduledDays = history.filter((h) => h.isScheduled);
        const completedDaysCount = scheduledDays.filter((h) => h.completed).length;
        return {
          habit,
          scheduledCount: scheduledDays.length,
          completedCount: completedDaysCount,
          rate: scheduledDays.length > 0 ? completedDaysCount / scheduledDays.length : 0,
        };
      })
      .filter((b) => !b.habit.archivedAt || b.scheduledCount > 0);

    return (
      <View style={styles.viewSection}>
        {/* Nav */}
        <View style={styles.navHeader}>
          {/* @ts-ignore */}
          <PressableScale onPress={handlePrevMonth} style={styles.navButton}>
            <Typography variant="bodyBold" color={theme.colors.text}>
              ◀
            </Typography>
          </PressableScale>
          <Typography variant="bodyBold" style={styles.navLabel}>
            {monthLabel}
          </Typography>
          {/* @ts-ignore */}
          <PressableScale onPress={handleNextMonth} style={styles.navButton}>
            <Typography variant="bodyBold" color={theme.colors.text}>
              ▶
            </Typography>
          </PressableScale>
        </View>

        {/* Weekday headers */}
        <View style={styles.calendarHeaderRow}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
            <View key={idx} style={styles.calendarHeaderCell}>
              <Typography variant="caption" style={styles.calendarHeaderCellText}>
                {day}
              </Typography>
            </View>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.calendarGrid}>
          {monthCells.map((cell, idx) => {
            const isToday = isSameDay(cell.date, new Date());
            const { total, rate } = appActions.getDayStats(cell.dateString);
            let cellBg: string = theme.colors.paper;
            let cellOpacity = 1;
            if (!cell.isCurrentMonth) {
              cellBg = theme.colors.background;
              cellOpacity = 0.4;
            } else if (total > 0) {
              if (rate === 1) cellBg = theme.colors.success;
              else if (rate > 0) cellBg = theme.colors.warning;
              else if (cell.date <= new Date()) cellBg = theme.colors.danger;
            }
            return (
              <PressableScale
                key={`${cell.dateString}-${idx}`}
                onPress={() => {
                  if (cell.isCurrentMonth) handleOpenDayHistory(cell.date);
                }}
                style={[
                  styles.calendarCell,
                  { backgroundColor: cellBg, opacity: cellOpacity },
                  isToday && styles.calendarCellToday,
                ]}
              >
                <Typography
                  variant="mono"
                  style={styles.calendarCellText}
                  color={theme.colors.text}
                >
                  {cell.dayNumber}
                </Typography>
              </PressableScale>
            );
          })}
        </View>

        <Typography variant="caption" style={styles.infoText}>
          💡 Tap a cell to see its habit list.
        </Typography>

        {/* Monthly breakdown */}
        <View style={styles.breakdownContainer}>
          <Typography variant="bodyBold" uppercase style={styles.chartTitle}>
            Habit Breakdown
          </Typography>
          {habitBreakdown.map(({ habit, scheduledCount, completedCount, rate }) => {
            const percentage = Math.round(rate * 100);
            let barColor: string = theme.colors.paper;
            if (scheduledCount > 0) {
              barColor =
                rate === 1
                  ? theme.colors.success
                  : rate > 0
                    ? theme.colors.warning
                    : theme.colors.danger;
            }
            return (
              <View key={habit.id} style={styles.breakdownItem}>
                <View style={styles.breakdownTextRow}>
                  <Typography style={{ marginRight: 6 }}>{habit.emoji || '⚡'}</Typography>
                  <Typography
                    variant="bodyBold"
                    style={styles.breakdownHabitTitle}
                    numberOfLines={1}
                  >
                    {habit.title}
                  </Typography>
                  <Typography variant="mono" style={styles.breakdownFraction}>
                    {completedCount}/{scheduledCount} D ({percentage}%)
                  </Typography>
                </View>
                <View style={styles.progressBarOuter}>
                  <View
                    style={[
                      styles.progressBarInner,
                      { width: `${percentage}%`, backgroundColor: barColor },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
        {renderInsights()}
      </View>
    );
  };

  // ── Year View ──
  const renderYearView = () => {
    const yearLabel = yearAnchorDate.getFullYear().toString();
    
    const weeks: YearGridCell[][] = [];
    yearCells.forEach(cell => {
      if (!weeks[cell.weekIndex]) weeks[cell.weekIndex] = [];
      weeks[cell.weekIndex].push(cell);
    });

    const monthLabels: { month: string, weekIndex: number }[] = [];
    let currentMonth = -1;
    yearCells.forEach(cell => {
      if (cell.isCurrentYear && cell.date.getMonth() !== currentMonth) {
        currentMonth = cell.date.getMonth();
        monthLabels.push({ month: getMonthShortName(cell.date), weekIndex: cell.weekIndex });
      }
    });

    return (
      <View style={styles.viewSection}>
        {/* Nav */}
        <View style={styles.navHeader}>
          {/* @ts-ignore */}
          <PressableScale onPress={handlePrevYear} style={styles.navButton}>
            <Typography variant="bodyBold" color={theme.colors.text}>
              ◀
            </Typography>
          </PressableScale>
          <Typography variant="bodyBold" style={styles.navLabel}>
            {yearLabel}
          </Typography>
          {/* @ts-ignore */}
          <PressableScale onPress={handleNextYear} style={styles.navButton}>
            <Typography variant="bodyBold" color={theme.colors.text}>
              ▶
            </Typography>
          </PressableScale>
        </View>

        <ScrollView 
          ref={yearScrollRef}
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.yearScrollContent}
        >
          <View>
            <View style={styles.yearMonthsHeader}>
              {monthLabels.map((lbl, idx) => (
                <View key={idx} style={[styles.yearMonthLabelContainer, { left: lbl.weekIndex * 16 }]}>
                  <Typography variant="caption" style={styles.yearMonthLabel}>{lbl.month}</Typography>
                </View>
              ))}
            </View>

            <View style={styles.yearGridContainer}>
              <View style={styles.yearDayLabels}>
                {['M', '', 'W', '', 'F', '', ''].map((day, idx) => (
                  <View key={idx} style={styles.yearDayLabelCell}>
                    <Typography variant="caption" style={styles.yearDayLabelText}>{day}</Typography>
                  </View>
                ))}
              </View>

              <View style={styles.yearGrid}>
                {weeks.map((week, wIdx) => (
                  <View key={wIdx} style={styles.yearWeekCol}>
                    {week.map((cell, dIdx) => {
                      const isToday = isSameDay(cell.date, new Date());
                      const { total, rate } = appActions.getDayStats(cell.dateString);
                      
                      let cellBg: string = theme.colors.paper;
                      let cellOpacity = 1;
                      
                      if (!cell.isCurrentYear) {
                        cellBg = theme.colors.background;
                        cellOpacity = 0.3;
                      } else if (total > 0) {
                        if (rate === 0) {
                          cellBg = theme.colors.danger;
                          cellOpacity = 0.4;
                        } else if (rate < 0.5) {
                          cellBg = theme.colors.warning;
                          cellOpacity = 0.6;
                        } else if (rate < 1) {
                          cellBg = theme.colors.warning;
                          cellOpacity = 1;
                        } else {
                          cellBg = theme.colors.success;
                          cellOpacity = 1;
                        }
                      }
                      
                      return (
                        <PressableScale
                          key={cell.dateString}
                          onPress={() => handleOpenDayHistory(cell.date)}
                          style={[
                            styles.yearCell,
                            { backgroundColor: cellBg, opacity: cellOpacity },
                            isToday && styles.yearCellToday,
                          ]}
                        />
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <Typography variant="caption" style={styles.infoText}>
          💡 Tap a cell to see its habit list.
        </Typography>
      </View>
    );
  };

  // ── Bottom Sheet Details ──
  const renderSelectedDayDetails = () => (
    <View style={styles.detailsSection}>
      {selectedDayStats.total > 0 && (
        <View style={styles.detailsStatRow}>
          <Typography variant="mono" style={styles.detailsSubtitle}>
            {selectedDayStats.completed} / {selectedDayStats.total} HABITS COMPLETED
          </Typography>
        </View>
      )}
      {selectedDayStats.total === 0 ? (
        <BrutalistCard style={styles.emptyCard} backgroundColor={theme.colors.background}>
          <Typography variant="bodyBold" style={styles.emptyText}>
            NO HABITS SCHEDULED
          </Typography>
        </BrutalistCard>
      ) : (
        selectedDayStats.entries.map((entry) => (
          <ReadOnlyHabitItem key={entry.habitId} entry={entry} dateStr={selectedDateString} />
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" uppercase>
          ANALYTICS
        </Typography>
        <Typography variant="mono" style={styles.subtitle}>
          YOUR HABIT PROGRESS
        </Typography>
      </View>

      {renderSwitcher()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === 'week' ? renderWeekView() : viewMode === 'month' ? renderMonthView() : renderYearView()}
      </ScrollView>

      <BrutalistBottomSheet
        visible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
        title={
          getDayName(selectedDate) +
          ', ' +
          getMonthShortName(selectedDate) +
          ' ' +
          selectedDate.getDate()
        }
      >
        {renderSelectedDayDetails()}
      </BrutalistBottomSheet>

      <View style={styles.hiddenCaptureContainer} pointerEvents="none">
        <ViewShot ref={shareRef} options={{ format: 'png', quality: 1 }}>
          <WeeklySummaryCard weekAnchorDate={weekAnchorDate} />
        </ViewShot>
      </View>
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
  header: { marginBottom: 16 },
  subtitle: { fontSize: 10, color: theme.colors.textMuted, marginTop: 4 },
  switcherContainer: {
    flexDirection: 'row',
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
    marginBottom: 16,
    overflow: 'hidden',
  },
  switcherButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: theme.colors.paper,
  },
  switcherButtonActive: { backgroundColor: theme.colors.warning },
  switcherButtonSeparator: { borderLeftWidth: theme.borderWidth, borderColor: theme.colors.border },
  switcherText: { fontSize: 12, fontFamily: theme.fonts.heading, color: theme.colors.textMuted },
  switcherTextActive: { color: theme.colors.text },
  scrollView: { flex: 1, marginTop: 8 },
  scrollViewContent: { paddingBottom: 120 },
  viewSection: { marginBottom: 20 },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.paper,
  },
  navLabel: { fontSize: 13, fontFamily: theme.fonts.mono, textAlign: 'center' },
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
    overflow: 'hidden',
  },
  weekDayCell: {
    flex: 1,
    aspectRatio: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRightWidth: 1.5,
    borderColor: theme.colors.border,
    position: 'relative',
  },
  weekDayCellToday: { backgroundColor: theme.colors.background },
  weekDayLabel: { fontSize: 9, fontFamily: theme.fonts.heading, color: theme.colors.textMuted },
  weekDateLabel: { fontSize: 15, fontFamily: theme.fonts.mono, fontWeight: 'bold', marginTop: 2 },
  weekStatusIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4 },
  infoText: {
    marginTop: 8,
    color: theme.colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  chartContainer: {
    marginTop: 20,
    padding: 14,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
  },
  chartTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.heading,
    marginBottom: 14,
    textAlign: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingBottom: 4,
  },
  chartBarWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  chartPercentageText: { fontSize: 8, color: theme.colors.textMuted, marginBottom: 4 },
  chartBar: {
    width: 20,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 3,
    borderBottomWidth: 0,
  },
  chartBarLabel: { fontSize: 10, marginTop: 6, fontWeight: 'bold' },
  calendarHeaderRow: { flexDirection: 'row', marginBottom: 6 },
  calendarHeaderCell: { width: '14.285%', alignItems: 'center', justifyContent: 'center' },
  calendarHeaderCellText: { fontSize: 11, fontWeight: 'bold', color: theme.colors.textMuted },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
    overflow: 'hidden',
  },
  calendarCell: {
    width: '14.285%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.75,
    borderColor: theme.colors.border,
  },
  calendarCellToday: { borderWidth: 2, borderColor: theme.colors.warning },
  calendarCellText: { fontSize: 13 },
  breakdownContainer: {
    marginTop: 20,
    padding: 14,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
  },
  breakdownItem: { marginBottom: 12 },
  breakdownTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  breakdownHabitTitle: { fontSize: 12, flex: 1, marginRight: 8 },
  breakdownFraction: { fontSize: 10, color: theme.colors.textMuted },
  progressBarOuter: {
    height: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarInner: { height: '100%' },
  detailsSection: { marginTop: 4, minHeight: 100 },
  detailsStatRow: { alignItems: 'center', marginBottom: 12 },
  detailsSubtitle: { fontSize: 11, color: theme.colors.textMuted },
  cardSpacing: { marginVertical: 6 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: theme.colors.border },
  checkboxTick: { fontSize: 14, lineHeight: 18 },
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
  emojiText: { fontSize: 14 },
  textContainer: { flex: 1, justifyContent: 'center' },
  customStrike: {
    position: 'absolute',
    top: '50%',
    left: 0,
    height: 2,
    backgroundColor: theme.colors.text,
    marginTop: -1,
  },
  emptyCard: { paddingVertical: 20, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: theme.colors.textMuted, fontSize: 12, textAlign: 'center' },
  yearScrollContent: { paddingBottom: 8, paddingHorizontal: 4 },
  yearMonthsHeader: { height: 20, position: 'relative', marginLeft: 20 },
  yearMonthLabelContainer: { position: 'absolute', top: 0 },
  yearMonthLabel: { fontSize: 10, color: theme.colors.textMuted },
  yearGridContainer: { flexDirection: 'row' },
  yearDayLabels: { width: 16, marginRight: 4 },
  yearDayLabelCell: { height: 12, marginBottom: 4, justifyContent: 'center', alignItems: 'center' },
  yearDayLabelText: { fontSize: 9, color: theme.colors.textMuted },
  yearGrid: { flexDirection: 'row', gap: 4 },
  yearWeekCol: { flexDirection: 'column', gap: 4 },
  yearCell: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 2,
  },
  yearCellToday: {
    borderWidth: 2,
    borderColor: theme.colors.text,
  },
  hiddenCaptureContainer: {
    position: 'absolute',
    top: -10000,
    left: 0,
    opacity: 0,
  },
  insightsContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: theme.borderWidth,
    borderColor: theme.colors.border,
  },
  insightCard: {
    marginBottom: 12,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  insightEmojiBox: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightEmoji: {
    fontSize: 18,
  },
  insightTextContent: {
    flex: 1,
    justifyContent: 'center',
  },
  insightDescription: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
}));
