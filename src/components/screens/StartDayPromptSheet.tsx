import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { Typography } from '@/ui/Typography';
import { observer } from '@legendapp/state/react';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { habitTemplates$ } from '@/state/store';
import { isHabitActiveOnDate } from '@/utils/date';

interface StartDayPromptSheetProps {
  visible: boolean;
  onClose: () => void;
  onStartDay: () => void;
}

export const StartDayPromptSheet = observer(function StartDayPromptSheet({
  visible,
  onClose,
  onStartDay,
}: StartDayPromptSheetProps) {
  const { theme } = useUnistyles();

  const templates = habitTemplates$.get();
  const activeToday = React.useMemo(() => {
    const list = templates || [];
    return list.filter((t) => t && t.id && t.title && isHabitActiveOnDate(t, new Date()) && !t.archivedAt);
  }, [templates]);

  return (
    <BrutalistBottomSheet visible={visible} onClose={onClose} title="NEW BUILD CYCLE">
      <View style={styles.container}>
        {/* Badge Indicator */}
        <View style={styles.badgeContainer}>
          <Typography style={styles.badgeEmoji}>🧱</Typography>
        </View>

        <Typography variant="h3" uppercase style={styles.title}>
          A New Day Begins
        </Typography>

        <Typography variant="body" style={styles.description}>
          Ready to crush your goals today? Pull your latest habits and start tracking to keep your streak alive!
        </Typography>

        {activeToday.length > 0 ? (
          <View style={styles.previewCard}>
            <Typography variant="mono" style={styles.previewTitle}>
              {"TODAY'S BUILD LIST"} ({activeToday.length})
            </Typography>
            <View style={styles.previewGrid}>
              {activeToday.slice(0, 4).map((habit) => (
                <View key={habit.id} style={styles.habitBadge}>
                  <Typography variant="caption" style={styles.habitEmoji}>
                    {habit.emoji || '⚡'}
                  </Typography>
                  <Typography variant="mono" style={styles.habitText} numberOfLines={1}>
                    {habit.title}
                  </Typography>
                </View>
              ))}
              {activeToday.length > 4 && (
                <View style={styles.habitBadgeMore}>
                  <Typography variant="mono" style={styles.habitTextMore}>
                    +{activeToday.length - 4} MORE
                  </Typography>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.previewCard}>
            <Typography variant="body" style={styles.noHabitsText}>
              No habits scheduled for today.
            </Typography>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <BrutalistButton
            onPress={onStartDay}
            backgroundColor={theme.colors.success}
            style={styles.startBtn}
          >
            START DAY ➔
          </BrutalistButton>

          <BrutalistButton
            onPress={onClose}
            backgroundColor={theme.colors.paper}
            style={styles.laterBtn}
          >
            LATER
          </BrutalistButton>
        </View>
      </View>
    </BrutalistBottomSheet>
  );
});

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  badgeContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    // solid shadow offset
    shadowColor: theme.colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  previewCard: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.background,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    padding: 12,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  habitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.paper,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: '48%',
  },
  habitEmoji: {
    marginRight: 4,
  },
  habitText: {
    fontSize: 10,
  },
  habitBadgeMore: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.warning,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  habitTextMore: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  noHabitsText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  buttonContainer: {
    alignSelf: 'stretch',
    gap: 12,
  },
  startBtn: {
    alignSelf: 'stretch',
  },
  laterBtn: {
    alignSelf: 'stretch',
  },
}));
