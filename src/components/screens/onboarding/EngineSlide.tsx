import React from 'react';
import { View } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { SlideContent } from './SlideContent';
import { styles } from './styles';

interface EngineSlideProps {
  activeIndex: SharedValue<number>;
}

export function EngineSlide({ activeIndex }: EngineSlideProps) {
  return (
    <SlideContent index={1} activeIndex={activeIndex}>
        <View style={styles.pillBadge}>
          <Typography variant="mono" style={styles.pillText}>⚡ HABITS</Typography>
        </View>

        <Typography variant="h2" style={styles.slideTitle}>
          Build Daily Discipline
        </Typography>
        <Typography variant="body" style={styles.slideDescription}>
          Create habits you do every day. Check them off and build a streak. Miss a day? Your card turns red to remind you to stay consistent.
        </Typography>

        {/* Visual Preview */}
        <View style={styles.previewContainer}>
          <BrutalistCard accentColor={BRUTALIST_THEME.colors.success}>
            <View style={styles.habitPreviewRow}>
              <View style={styles.checkboxDone}>
                <Typography variant="bodyBold" style={styles.checkmark}>✓</Typography>
              </View>
              <View style={styles.habitPreviewText}>
                <Typography variant="bodyBold" style={styles.doneText}>6AM CLUB WAKEUP</Typography>
                <Typography variant="caption">Completed today ✦ 12 day streak</Typography>
              </View>
            </View>
          </BrutalistCard>

          <BrutalistCard>
            <View style={styles.habitPreviewRow}>
              <View style={styles.checkboxPending} />
              <View style={styles.habitPreviewText}>
                <Typography variant="bodyBold">1 HOUR LEETCODE</Typography>
                <Typography variant="caption">Pending • Alternate days</Typography>
              </View>
            </View>
          </BrutalistCard>

          <BrutalistCard neglected>
            <View style={styles.habitPreviewRow}>
              <View style={[styles.checkboxPending, { borderColor: '#FFF' }]} />
              <View style={styles.habitPreviewText}>
                <Typography variant="bodyBold" color="#FFF">NO COFFEE BEFORE 10AM</Typography>
                <Typography variant="caption" style={{ color: '#FFCDD2' }}>⚠️ Missed — streak broken</Typography>
              </View>
            </View>
          </BrutalistCard>
        </View>

        <View style={styles.tipBox}>
          <Typography variant="mono" style={styles.tipText}>
            TIP: Tap a habit to check it off
          </Typography>
        </View>
      </SlideContent>
  );
}
