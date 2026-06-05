/* eslint-disable react-hooks/immutability */
"use no memo";
import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { appActions } from '@/state/store';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_WIDTH = Math.min(SCREEN_WIDTH, 480);

export function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const updateIndex = (index: number) => {
    setCurrentSlide(index);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      // Allow swiping between index 0 and 2
      const newTranslate = startX.value + event.translationX;
      translateX.value = Math.max(-CONTAINER_WIDTH * 2, Math.min(0, newTranslate));
    })
    .onEnd((event) => {
      const targetIndex = Math.round(-translateX.value / CONTAINER_WIDTH);
      const clampedIndex = Math.max(0, Math.min(2, targetIndex));
      
      translateX.value = withSpring(-clampedIndex * CONTAINER_WIDTH, {
        damping: 18,
        stiffness: 90,
      });
      runOnJS(updateIndex)(clampedIndex);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleNext = () => {
    if (currentSlide < 2) {
      const nextSlide = currentSlide + 1;
      translateX.value = withSpring(-nextSlide * CONTAINER_WIDTH, {
        damping: 18,
        stiffness: 90,
      });
      setCurrentSlide(nextSlide);
    } else {
      appActions.completeOnboarding();
    }
  };

  const handleDotPress = (index: number) => {
    translateX.value = withSpring(-index * CONTAINER_WIDTH, {
      damping: 18,
      stiffness: 90,
    });
    setCurrentSlide(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        {/* Header Branding */}
        <View style={styles.header}>
          <Typography variant="h1" style={styles.brandTitle} uppercase>
            BRICKDAY
          </Typography>
          <Typography variant="mono" style={styles.brandSubtitle}>
            EST. 2026 // SYSTEM: ACTIVE
          </Typography>
        </View>

        {/* Horizontal Slider Area */}
        <GestureDetector gesture={panGesture}>
          <View style={styles.pagerContainer}>
            <Animated.View style={[styles.pager, animatedStyle]}>
              
              {/* Slide 1 */}
              <View style={styles.slide}>
                <Typography variant="h2" style={styles.slideTitle}>
                  1. Build The Engine.
                </Typography>
                <Typography variant="body" style={styles.slideDescription}>
                  Establish daily habits. Neglect leads to decay. Keep the streak active.
                </Typography>
                
                {/* Visual Preview */}
                <View style={styles.previewContainer}>
                  <BrutalistCard accentColor={BRUTALIST_THEME.colors.success}>
                    <View style={styles.previewItem}>
                      <Typography variant="bodyBold" style={styles.strikeThrough}>
                        [X] 6AM CLUB WAKEUP
                      </Typography>
                    </View>
                  </BrutalistCard>
                  
                  <BrutalistCard>
                    <View style={styles.previewItem}>
                      <Typography variant="bodyBold">
                        [ ] 1 HOUR LEETCODE / SHADERS
                      </Typography>
                    </View>
                  </BrutalistCard>
                </View>
              </View>

              {/* Slide 2 */}
              <View style={styles.slide}>
                <Typography variant="h2" style={styles.slideTitle}>
                  2. Zero EMI. Full Pay.
                </Typography>
                <Typography variant="body" style={styles.slideDescription}>
                  Track high-value purchases. Save and pay in full. No debt, ever.
                </Typography>

                {/* Visual Preview */}
                <View style={styles.previewContainer}>
                  <BrutalistCard>
                    <Typography variant="bodyBold">M3 MACBOOK PRO (60%)</Typography>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '60%', backgroundColor: BRUTALIST_THEME.colors.warning }]} />
                    </View>
                    <Typography variant="caption" style={styles.progressText}>
                      $2,100 / $3,500 SAVED
                    </Typography>
                  </BrutalistCard>
                </View>
              </View>

              {/* Slide 3 */}
              <View style={styles.slide}>
                <Typography variant="h2" style={styles.slideTitle}>
                  3. Maintain The Circle.
                </Typography>
                <Typography variant="body" style={styles.slideDescription}>
                  Neglected projects and relationships decay visually, demanding immediate execution.
                </Typography>

                {/* Visual Preview */}
                <View style={styles.previewContainer}>
                  <BrutalistCard neglected={true}>
                    <Typography variant="bodyBold" color="#FFFFFF">
                      CYBERPUNK PORTFOLIO [DECAYED]
                    </Typography>
                    <Typography variant="caption" style={{ color: '#FFFFFF', marginTop: 4 }}>
                      ⚠️ NEGLECTED FOR 8 DAYS
                    </Typography>
                  </BrutalistCard>
                </View>
              </View>

            </Animated.View>
          </View>
        </GestureDetector>

        {/* Footer & Controls */}
        <View style={styles.footer}>
          {/* Slide Indicator Dots */}
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((i) => (
              <Pressable key={i} onPress={() => handleDotPress(i)}>
                <View
                  style={[
                    styles.dot,
                    currentSlide === i && styles.activeDot,
                  ]}
                />
              </Pressable>
            ))}
          </View>

          {/* Action Button */}
          <BrutalistButton
            onPress={handleNext}
            backgroundColor={currentSlide === 2 ? BRUTALIST_THEME.colors.success : BRUTALIST_THEME.colors.warning}
          >
            {currentSlide === 2 ? 'ENTER BRICKDAY' : 'NEXT STEP'}
          </BrutalistButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRUTALIST_THEME.colors.background,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: CONTAINER_WIDTH,
    alignSelf: 'center',
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 40,
    lineHeight: 44,
    color: BRUTALIST_THEME.colors.text,
  },
  brandSubtitle: {
    color: BRUTALIST_THEME.colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  pagerContainer: {
    height: 380,
    width: CONTAINER_WIDTH,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  pager: {
    flexDirection: 'row',
    width: CONTAINER_WIDTH * 3,
    height: '100%',
  },
  slide: {
    width: CONTAINER_WIDTH,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 8,
    color: BRUTALIST_THEME.colors.text,
  },
  slideDescription: {
    color: BRUTALIST_THEME.colors.textMuted,
    lineHeight: 20,
    marginBottom: 24,
  },
  previewContainer: {
    gap: 10,
    marginTop: 10,
  },
  previewItem: {
    paddingVertical: 4,
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: '#000',
  },
  progressBarBg: {
    height: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  progressText: {
    marginTop: 6,
    fontFamily: BRUTALIST_THEME.fonts.mono,
  },
  footer: {
    width: '100%',
    marginBottom: 30,
    gap: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: BRUTALIST_THEME.colors.border,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  activeDot: {
    backgroundColor: BRUTALIST_THEME.colors.border,
  },
});
