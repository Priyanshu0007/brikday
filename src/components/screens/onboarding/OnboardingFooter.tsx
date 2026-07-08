import React from 'react';
import { View } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { Typography } from '@/ui/Typography';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { AnimatedDot } from './AnimatedDot';
import { TOTAL_SLIDES } from './constants';
import { styles } from './styles';
import { useUnistyles } from 'react-native-unistyles';

interface OnboardingFooterProps {
  currentPage: number;
  activeIndex: SharedValue<number>;
  onNext: () => void;
  validationError?: string;
}

export function OnboardingFooter({ currentPage, activeIndex, onNext, validationError }: OnboardingFooterProps) {
  const { theme } = useUnistyles();

  const getButtonLabel = () => {
    switch (currentPage) {
      case 0: return "LET'S GO";
      case TOTAL_SLIDES - 1: return "LET'S BUILD 🧱";
      default: return 'NEXT';
    }
  };

  const getButtonColor = () => {
    if (currentPage === TOTAL_SLIDES - 1) return theme.colors.success;
    return theme.colors.warning;
  };

  return (
    <View style={styles.footer}>
      {/* Validation Error */}
      {validationError ? (
        <Typography variant="mono" style={styles.validationError}>
          {validationError}
        </Typography>
      ) : null}

      {/* Dot Indicators */}
      <View style={styles.dotsContainer}>
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <AnimatedDot key={i} index={i} activeIndex={activeIndex} />
        ))}
      </View>

      {/* Page Counter */}
      <Typography variant="mono" style={styles.pageCounter}>
        {currentPage + 1} / {TOTAL_SLIDES}
      </Typography>

      {/* Action Button */}
      <BrutalistButton onPress={onNext} backgroundColor={getButtonColor()}>
        {getButtonLabel()}
      </BrutalistButton>
    </View>
  );
}
