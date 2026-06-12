import React from 'react';
import { View } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { SlideContent } from './SlideContent';
import { styles } from './styles';

interface WelcomeSlideProps {
  activeIndex: SharedValue<number>;
}

export function WelcomeSlide({ activeIndex }: WelcomeSlideProps) {
  return (
    <SlideContent index={0} activeIndex={activeIndex}>
        <View style={styles.welcomeEmoji}>
          <Typography variant="h1" style={styles.emojiText}>🧱</Typography>
        </View>

        <Typography variant="h2" style={styles.slideTitle}>
          What is Brickday?
        </Typography>
        <Typography variant="body" style={styles.slideDescription}>
          Brickday is your personal accountability system. It helps you build discipline through three pillars — daily habits, debt-free savings, and active project tracking.
        </Typography>

        <BrutalistCard>
          <View style={styles.conceptRow}>
            <Typography variant="bodyBold" style={styles.conceptIcon}>⚡</Typography>
            <View style={styles.conceptText}>
              <Typography variant="bodyBold">ENGINE</Typography>
              <Typography variant="caption">Daily habits & streaks</Typography>
            </View>
          </View>
        </BrutalistCard>

        <BrutalistCard>
          <View style={styles.conceptRow}>
            <Typography variant="bodyBold" style={styles.conceptIcon}>🪙</Typography>
            <View style={styles.conceptText}>
              <Typography variant="bodyBold">VAULT</Typography>
              <Typography variant="caption">Save & pay in full — zero EMI</Typography>
            </View>
          </View>
        </BrutalistCard>

        <BrutalistCard>
          <View style={styles.conceptRow}>
            <Typography variant="bodyBold" style={styles.conceptIcon}>🧱</Typography>
            <View style={styles.conceptText}>
              <Typography variant="bodyBold">BLUEPRINT</Typography>
              <Typography variant="caption">Projects & goals tracker</Typography>
            </View>
          </View>
        </BrutalistCard>
      </SlideContent>
  );
}
