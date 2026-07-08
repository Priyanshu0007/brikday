import React from 'react';
import { View } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { useUnistyles } from 'react-native-unistyles';
import { SlideContent } from './SlideContent';
import { styles } from './styles';

interface WelcomeSlideProps {
  activeIndex: SharedValue<number>;
}

export function WelcomeSlide({ activeIndex }: WelcomeSlideProps) {
  useUnistyles();
  return (
    <SlideContent index={0} activeIndex={activeIndex}>
      <View style={styles.welcomeEmoji}>
        <Typography variant="h1" style={styles.emojiText}>
          🧱
        </Typography>
      </View>

      <Typography variant="h2" style={[styles.slideTitle, { textAlign: 'center' }]}>
        BUILD YOUR LIFE,{'\n'}BRICK BY BRICK
      </Typography>
      <Typography variant="body" style={[styles.slideDescription, { textAlign: 'center' }]}>
        Track habits, save without debt, and ship your side projects.
        Let's set you up in under 2 minutes.
      </Typography>

      <BrutalistCard>
        <View style={styles.conceptRow}>
          <Typography variant="bodyBold" style={styles.conceptIcon}>
            ⚡
          </Typography>
          <View style={styles.conceptText}>
            <Typography variant="bodyBold">DAILY HABITS</Typography>
            <Typography variant="caption">Build streaks & stay consistent</Typography>
          </View>
        </View>
      </BrutalistCard>

      <BrutalistCard>
        <View style={styles.conceptRow}>
          <Typography variant="bodyBold" style={styles.conceptIcon}>
            🪙
          </Typography>
          <View style={styles.conceptText}>
            <Typography variant="bodyBold">SAVINGS VAULT</Typography>
            <Typography variant="caption">Save first, buy later — zero debt</Typography>
          </View>
        </View>
      </BrutalistCard>

      <BrutalistCard>
        <View style={styles.conceptRow}>
          <Typography variant="bodyBold" style={styles.conceptIcon}>
            🧱
          </Typography>
          <View style={styles.conceptText}>
            <Typography variant="bodyBold">SIDE PROJECTS</Typography>
            <Typography variant="caption">Track & ship what matters</Typography>
          </View>
        </View>
      </BrutalistCard>
    </SlideContent>
  );
}
