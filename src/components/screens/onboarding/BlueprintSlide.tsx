import React from 'react';
import { View } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { SlideContent } from './SlideContent';
import { styles } from './styles';

interface BlueprintSlideProps {
  activeIndex: SharedValue<number>;
}

export function BlueprintSlide({ activeIndex }: BlueprintSlideProps) {
  return (
    <SlideContent index={3} activeIndex={activeIndex}>
      <View style={[styles.pillBadge, { backgroundColor: '#DBEAFE' }]}>
        <Typography variant="mono" style={styles.pillText}>
          🧱 PROJECTS
        </Typography>
      </View>

      <Typography variant="h2" style={styles.slideTitle}>
        Track Every Project
      </Typography>
      <Typography variant="body" style={styles.slideDescription}>
        Side projects, work tasks, life goals — add them all. If you ignore a project too long, it
        turns red. Red cards demand your attention and keep you moving.
      </Typography>

      {/* Visual Preview */}
      <View style={styles.previewContainer}>
        <BrutalistCard>
          <View style={styles.projectPreviewRow}>
            <View>
              <Typography variant="bodyBold">VELOCITY TRANSIT APP</Typography>
              <Typography variant="caption">Category: WORK</Typography>
            </View>
            <View style={styles.activeTag}>
              <Typography variant="mono" style={styles.activeTagText}>
                ACTIVE
              </Typography>
            </View>
          </View>
        </BrutalistCard>

        <BrutalistCard neglected>
          <View style={styles.projectPreviewRow}>
            <View>
              <Typography variant="bodyBold" color="#FFF">
                CYBERPUNK PORTFOLIO
              </Typography>
              <Typography variant="caption" style={{ color: '#FFCDD2' }}>
                ⚠️ IGNORED — 8 DAYS
              </Typography>
            </View>
            <View style={[styles.activeTag, { backgroundColor: '#FFFFFF33' }]}>
              <Typography variant="mono" style={[styles.activeTagText, { color: '#FFF' }]}>
                IGNORED
              </Typography>
            </View>
          </View>
        </BrutalistCard>
      </View>

      <View style={styles.tipBox}>
        <Typography variant="mono" style={styles.tipText}>
          TIP: Tap the button on any card to update its status
        </Typography>
      </View>
    </SlideContent>
  );
}
