import React from 'react';
import { View, Pressable } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { Typography } from '@/ui/Typography';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { appActions } from '@/state/store';
import { AnimatedDot } from './AnimatedDot';
import { TOTAL_SLIDES } from './constants';
import { styles } from './styles';
import { useUnistyles } from 'react-native-unistyles';

interface OnboardingFooterProps {
  currentPage: number;
  activeIndex: SharedValue<number>;
  onNext: () => void;
}

export function OnboardingFooter({ currentPage, activeIndex, onNext }: OnboardingFooterProps) {
  const { theme } = useUnistyles();

  const getButtonLabel = () => {
    if (currentPage === TOTAL_SLIDES - 1) return 'GET STARTED';
    if (currentPage === 0) return 'SEE HOW IT WORKS';
    return 'NEXT';
  };

  const getButtonColor = () => {
    if (currentPage === TOTAL_SLIDES - 1) return theme.colors.success;
    return theme.colors.warning;
  };

  return (
    <View style={styles.footer}>
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
      <BrutalistButton
        onPress={onNext}
        backgroundColor={getButtonColor()}
      >
        {getButtonLabel()}
      </BrutalistButton>

      {/* Skip */}
      {currentPage < TOTAL_SLIDES - 1 && (
        <Pressable
          onPress={() => appActions.completeOnboarding()}
          style={styles.skipButton}
          hitSlop={12}
        >
          <Typography variant="caption" style={styles.skipText}>
            skip
          </Typography>
        </Pressable>
      )}
    </View>
  );
}
