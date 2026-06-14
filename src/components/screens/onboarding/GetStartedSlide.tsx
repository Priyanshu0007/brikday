import React from 'react';
import { View } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { SlideContent } from './SlideContent';
import { styles } from './styles';

interface GetStartedSlideProps {
  activeIndex: SharedValue<number>;
}

export function GetStartedSlide({ activeIndex }: GetStartedSlideProps) {
  return (
    <SlideContent index={4} activeIndex={activeIndex}>
        <View style={styles.finalEmoji}>
          <Typography variant="h1" style={styles.emojiTextLarge}>🔥</Typography>
        </View>

        <Typography variant="h2" style={[styles.slideTitle, { textAlign: 'center' }]}>
          Ready to Build?
        </Typography>
        <Typography variant="body" style={[styles.slideDescription, { textAlign: 'center' }]}>
          Every brick you place today compounds into the life you want tomorrow. No shortcuts, no excuses — just raw consistency.
        </Typography>

        <View style={styles.summaryContainer}>
          <BrutalistCard>
            <View style={styles.summaryRow}>
              <Typography variant="bodyBold" style={styles.summaryEmoji}>⚡</Typography>
              <Typography variant="body">Set up your daily habits</Typography>
            </View>
          </BrutalistCard>
          <BrutalistCard>
            <View style={styles.summaryRow}>
              <Typography variant="bodyBold" style={styles.summaryEmoji}>🪙</Typography>
              <Typography variant="body">Create your first savings goal</Typography>
            </View>
          </BrutalistCard>
          <BrutalistCard>
            <View style={styles.summaryRow}>
              <Typography variant="bodyBold" style={styles.summaryEmoji}>🧱</Typography>
              <Typography variant="body">Add projects to your list</Typography>
            </View>
          </BrutalistCard>
        </View>

        <View style={styles.motivationBox}>
          <Typography variant="mono" style={styles.motivationText}>
            "DISCIPLINE IS THE BRIDGE BETWEEN{'\n'}GOALS AND ACCOMPLISHMENT"
          </Typography>
        </View>
      </SlideContent>
  );
}
