import React from 'react';
import { View, Pressable } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { Typography } from '@/ui/Typography';
import { useUnistyles } from 'react-native-unistyles';
import { triggerHaptic } from '@/ui/haptics';
import { SlideContent } from './SlideContent';
import { styles } from './styles';

interface NotificationSlideProps {
  activeIndex: SharedValue<number>;
  notificationsEnabled: boolean;
  onToggleNotifications: (enabled: boolean) => void;
  reminderHour: number;
  reminderMinute: number;
  onTimeChange: (hour: number, minute: number) => void;
}

export function NotificationSlide({
  activeIndex,
  notificationsEnabled,
  onToggleNotifications,
  reminderHour,
  reminderMinute,
  onTimeChange,
}: NotificationSlideProps) {
  const { theme } = useUnistyles();

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${String(displayHour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
  };

  const incrementHour = () => {
    triggerHaptic('selection');
    onTimeChange((reminderHour + 1) % 24, reminderMinute);
  };

  const decrementHour = () => {
    triggerHaptic('selection');
    onTimeChange((reminderHour + 23) % 24, reminderMinute);
  };

  const incrementMinute = () => {
    triggerHaptic('selection');
    // Step by 15 minutes
    const nextMinute = (reminderMinute + 15) % 60;
    const hourRollover = reminderMinute + 15 >= 60 ? 1 : 0;
    onTimeChange((reminderHour + hourRollover) % 24, nextMinute);
  };

  const decrementMinute = () => {
    triggerHaptic('selection');
    const prevMinute = (reminderMinute + 45) % 60;
    const hourRollback = reminderMinute - 15 < 0 ? -1 : 0;
    onTimeChange((reminderHour + 24 + hourRollback) % 24, prevMinute);
  };

  return (
    <SlideContent index={4} activeIndex={activeIndex}>
      <View style={styles.finalEmoji}>
        <Typography variant="h1" style={styles.emojiTextLarge}>
          🔔
        </Typography>
      </View>

      <Typography variant="h2" style={[styles.slideTitle, { textAlign: 'center' }]}>
        STAY ON TRACK
      </Typography>
      <Typography variant="body" style={[styles.slideDescription, { textAlign: 'center' }]}>
        Get a daily reminder to check off your habits. You can always change this in settings.
      </Typography>

      <View style={styles.notifContainer}>
        {/* Toggle */}
        <Pressable
          onPress={() => {
            triggerHaptic('selection');
            onToggleNotifications(!notificationsEnabled);
          }}
          style={styles.notifToggleRow}
        >
          <View style={styles.notifToggleLabel}>
            <Typography style={styles.notifToggleEmoji}>⏰</Typography>
            <Typography variant="bodyBold">MORNING REMINDER</Typography>
          </View>
          {/* Brutalist toggle */}
          <View style={[styles.toggleTrack, notificationsEnabled && styles.toggleTrackActive]}>
            <View style={[styles.toggleThumb, notificationsEnabled && styles.toggleThumbActive]} />
          </View>
        </Pressable>

        {/* Time Picker (only if enabled) */}
        {notificationsEnabled && (
          <View style={styles.timePickerContainer}>
            <View style={styles.timePickerRow}>
              {/* Hour controls */}
              <Pressable onPress={decrementHour} style={styles.timeButton}>
                <Typography variant="bodyBold">−</Typography>
              </Pressable>

              <Typography variant="mono" style={styles.timeDisplay}>
                {formatTime(reminderHour, reminderMinute)}
              </Typography>

              <Pressable onPress={incrementHour} style={styles.timeButton}>
                <Typography variant="bodyBold">+</Typography>
              </Pressable>
            </View>

            {/* Minute adjustment */}
            <View style={[styles.timePickerRow, { marginTop: 8 }]}>
              <Pressable onPress={decrementMinute} style={[styles.timeButton, { width: 34, height: 34 }]}>
                <Typography variant="caption" style={{ fontWeight: 'bold' }}>-15</Typography>
              </Pressable>

              <Typography variant="mono" style={styles.timeLabel}>
                MINUTES
              </Typography>

              <Pressable onPress={incrementMinute} style={[styles.timeButton, { width: 34, height: 34 }]}>
                <Typography variant="caption" style={{ fontWeight: 'bold' }}>+15</Typography>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <View style={styles.motivationBox}>
        <Typography variant="mono" style={styles.motivationText}>
          {"\"DISCIPLINE IS THE BRIDGE BETWEEN\nGOALS AND ACCOMPLISHMENT\""}
        </Typography>
      </View>
    </SlideContent>
  );
}
