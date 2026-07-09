import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Typography } from '@/ui/Typography';
import { appActions, streak$ } from '@/state/store';
import { observer } from '@legendapp/state/react';
import { getWeekDates, getMonthShortName } from '@/utils/date';

interface Props {
  weekAnchorDate: Date;
}

export const WeeklySummaryCard = observer(({ weekAnchorDate }: Props) => {

  
  const cells = getWeekDates(weekAnchorDate);
  const firstDay = cells[0]?.date;
  const lastDay = cells[6]?.date;
  const rangeLabel = firstDay && lastDay
    ? `${getMonthShortName(firstDay)} ${firstDay.getDate()} – ${getMonthShortName(lastDay)} ${lastDay.getDate()}, ${lastDay.getFullYear()}`
    : '';

  const summary = appActions.getWeekSummary(weekAnchorDate);
  const totalPercentage = Math.round(summary.totalRate * 100);
  const streak = streak$.get();
  
  const renderProgressBar = (rate: number, length: number = 10) => {
    const filled = Math.round(rate * length);
    const empty = length - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Typography variant="bodyBold" style={styles.headerText}>BRIKDAY // WEEKLY REPORT</Typography>
        <Typography variant="mono" style={styles.dateRange}>{rangeLabel.toUpperCase()}</Typography>
      </View>
      
      <View style={styles.divider} />

      <View style={styles.mainStats}>
        <Typography variant="h1" style={styles.percentageText}>
          {renderProgressBar(summary.totalRate, 2)} {totalPercentage}% {renderProgressBar(summary.totalRate, 2)}
        </Typography>
        <Typography variant="bodyBold" style={styles.completionLabel}>COMPLETION RATE</Typography>
      </View>

      <View style={styles.highlights}>
        <Typography variant="bodyBold" style={styles.highlightText}>
          BEST DAY: {summary.bestDay}
        </Typography>
        <Typography variant="bodyBold" style={styles.highlightText}>
          STREAK: {streak} DAYS 🔥
        </Typography>
      </View>

      {summary.perHabitRates.length > 0 && (
        <View style={styles.breakdown}>
          <Typography variant="bodyBold" style={styles.breakdownHeader}>
            ─── HABIT BREAKDOWN ───
          </Typography>
          {summary.perHabitRates.map((habit, idx) => (
            <View key={idx} style={styles.habitRow}>
              <Typography variant="mono" style={styles.habitTitle} numberOfLines={1}>
                {(habit.title ?? '').substring(0, 12).padEnd(12, ' ')}
              </Typography>
              <Typography variant="mono" style={styles.habitBar}>
                {renderProgressBar(habit.rate)}  {Math.round(habit.rate * 100).toString().padStart(3, ' ')}%
              </Typography>
            </View>
          ))}
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Typography variant="caption" style={styles.footerText}>
          BUILT WITH BRIKDAY
        </Typography>
      </View>
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.paper,
    borderWidth: 4,
    borderColor: '#000000',
    padding: 24,
    width: 380, // Fixed width for screenshot consistency
  },
  header: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
  },
  dateRange: {
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 4,
    backgroundColor: '#000000',
    marginVertical: 16,
  },
  mainStats: {
    alignItems: 'center',
    marginBottom: 24,
  },
  percentageText: {
    fontSize: 28,
    marginBottom: 4,
    textAlign: 'center',
  },
  completionLabel: {
    fontSize: 14,
  },
  highlights: {
    marginBottom: 24,
  },
  highlightText: {
    fontSize: 14,
    marginBottom: 4,
  },
  breakdown: {
    marginBottom: 16,
  },
  breakdownHeader: {
    fontSize: 14,
    marginBottom: 12,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitTitle: {
    fontSize: 12,
    width: 120, // Fixed width for alignment
  },
  habitBar: {
    fontSize: 12,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    fontFamily: theme.fonts.heading,
  }
}));
