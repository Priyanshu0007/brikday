/* eslint-disable react-hooks/immutability */
"use no memo";
import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor,
  Extrapolation,
} from 'react-native-reanimated';
import PagerView from 'react-native-pager-view';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { appActions } from '@/state/store';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_SLIDES = 5;

// ─── Animated Dot ───────────────────────────────────────────
function AnimatedDot({ index, activeIndex }: { index: number; activeIndex: Animated.SharedValue<number> }) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];
    const width = interpolate(
      activeIndex.value,
      inputRange,
      [10, 28, 10],
      Extrapolation.CLAMP,
    );
    const bgColor = interpolateColor(
      activeIndex.value,
      inputRange,
      ['#D1D5DB', '#000000', '#D1D5DB'],
    );
    return { width, backgroundColor: bgColor };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

// ─── Slide Wrapper with Fade-In ─────────────────────────────
function SlideContent({ index, activeIndex, children }: {
  index: number;
  activeIndex: Animated.SharedValue<number>;
  children: React.ReactNode;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      activeIndex.value,
      [index - 0.6, index, index + 0.6],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      activeIndex.value,
      [index - 0.6, index, index + 0.6],
      [30, 0, 30],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <View style={styles.slideOuter}>
      <Animated.View style={[styles.slideInner, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────
export function OnboardingScreen() {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const activeIndex = useSharedValue(0);

  const onPageScroll = useCallback((e: any) => {
    const { position, offset } = e.nativeEvent;
    activeIndex.value = position + offset;
  }, []);

  const onPageSelected = useCallback((e: any) => {
    setCurrentPage(e.nativeEvent.position);
  }, []);

  const goNext = () => {
    if (currentPage < TOTAL_SLIDES - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      appActions.completeOnboarding();
    }
  };

  const goToPage = (page: number) => {
    pagerRef.current?.setPage(page);
  };

  const getButtonLabel = () => {
    if (currentPage === TOTAL_SLIDES - 1) return 'GET STARTED';
    if (currentPage === 0) return 'SEE HOW IT WORKS';
    return 'NEXT';
  };

  const getButtonColor = () => {
    if (currentPage === TOTAL_SLIDES - 1) return BRUTALIST_THEME.colors.success;
    return BRUTALIST_THEME.colors.warning;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>

        {/* ── Header ─────────────────────────── */}
        <View style={styles.header}>
          <Typography variant="h1" style={styles.brandTitle} uppercase>
            BRICKDAY
          </Typography>
          <Typography variant="mono" style={styles.brandSubtitle}>
            BUILD YOUR LIFE, BRICK BY BRICK
          </Typography>
        </View>

        {/* ── PagerView Slides ───────────────── */}
        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageScroll={onPageScroll}
          onPageSelected={onPageSelected}
          overdrag
        >

          {/* ─ SLIDE 0: WELCOME ─ */}
          <View key="0" style={styles.page}>
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
          </View>

          {/* ─ SLIDE 1: ENGINE ─ */}
          <View key="1" style={styles.page}>
            <SlideContent index={1} activeIndex={activeIndex}>
              <View style={styles.pillBadge}>
                <Typography variant="mono" style={styles.pillText}>⚡ ENGINE</Typography>
              </View>

              <Typography variant="h2" style={styles.slideTitle}>
                Build Daily Discipline
              </Typography>
              <Typography variant="body" style={styles.slideDescription}>
                Create habits you commit to every day. Check them off and build a streak. Miss a day? Your card turns red — a visual reminder to stay consistent.
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
                      <Typography variant="caption" style={{ color: '#FFCDD2' }}>⚠️ Neglected — streak broken</Typography>
                    </View>
                  </View>
                </BrutalistCard>
              </View>

              <View style={styles.tipBox}>
                <Typography variant="mono" style={styles.tipText}>
                  TIP: Swipe a habit to edit or delete it
                </Typography>
              </View>
            </SlideContent>
          </View>

          {/* ─ SLIDE 2: VAULT ─ */}
          <View key="2" style={styles.page}>
            <SlideContent index={2} activeIndex={activeIndex}>
              <View style={[styles.pillBadge, { backgroundColor: '#FEF3C7' }]}>
                <Typography variant="mono" style={styles.pillText}>🪙 VAULT</Typography>
              </View>

              <Typography variant="h2" style={styles.slideTitle}>
                Save First, Buy Later
              </Typography>
              <Typography variant="body" style={styles.slideDescription}>
                Want something expensive? Create a savings goal. Log each deposit with its source. When you hit 100%, buy it outright. No EMIs, no debt, full ownership.
              </Typography>

              {/* Visual Preview */}
              <View style={styles.previewContainer}>
                <BrutalistCard>
                  <Typography variant="bodyBold">M3 MACBOOK PRO</Typography>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '60%', backgroundColor: BRUTALIST_THEME.colors.warning }]} />
                  </View>
                  <View style={styles.progressRow}>
                    <Typography variant="caption">$2,100 saved</Typography>
                    <Typography variant="caption" style={styles.progressRight}>$3,500 goal</Typography>
                  </View>
                </BrutalistCard>

                <BrutalistCard accentColor={BRUTALIST_THEME.colors.success}>
                  <Typography variant="bodyBold">IPAD PRO OLED</Typography>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '100%', backgroundColor: BRUTALIST_THEME.colors.success }]} />
                  </View>
                  <View style={styles.progressRow}>
                    <Typography variant="caption">$1,500 saved</Typography>
                    <Typography variant="caption" style={styles.progressRight}>✅ READY TO BUY</Typography>
                  </View>
                </BrutalistCard>
              </View>

              <View style={styles.tipBox}>
                <Typography variant="mono" style={styles.tipText}>
                  TIP: Tap "+ Add Saving" to log each deposit
                </Typography>
              </View>
            </SlideContent>
          </View>

          {/* ─ SLIDE 3: BLUEPRINT ─ */}
          <View key="3" style={styles.page}>
            <SlideContent index={3} activeIndex={activeIndex}>
              <View style={[styles.pillBadge, { backgroundColor: '#DBEAFE' }]}>
                <Typography variant="mono" style={styles.pillText}>🧱 BLUEPRINT</Typography>
              </View>

              <Typography variant="h2" style={styles.slideTitle}>
                Track Every Project
              </Typography>
              <Typography variant="body" style={styles.slideDescription}>
                Side projects, work tasks, life goals — add them all. If you ignore a project too long, it decays visually. Red cards demand your attention and keep you moving.
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
                      <Typography variant="mono" style={styles.activeTagText}>ACTIVE</Typography>
                    </View>
                  </View>
                </BrutalistCard>

                <BrutalistCard neglected>
                  <View style={styles.projectPreviewRow}>
                    <View>
                      <Typography variant="bodyBold" color="#FFF">CYBERPUNK PORTFOLIO</Typography>
                      <Typography variant="caption" style={{ color: '#FFCDD2' }}>⚠️ NEGLECTED — 8 DAYS</Typography>
                    </View>
                    <View style={[styles.activeTag, { backgroundColor: '#FFFFFF33' }]}>
                      <Typography variant="mono" style={[styles.activeTagText, { color: '#FFF' }]}>DECAYED</Typography>
                    </View>
                  </View>
                </BrutalistCard>
              </View>

              <View style={styles.tipBox}>
                <Typography variant="mono" style={styles.tipText}>
                  TIP: Long-press to mark as neglected/active
                </Typography>
              </View>
            </SlideContent>
          </View>

          {/* ─ SLIDE 4: GET STARTED ─ */}
          <View key="4" style={styles.page}>
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
                    <Typography variant="body">Add projects to your blueprint</Typography>
                  </View>
                </BrutalistCard>
              </View>

              <View style={styles.motivationBox}>
                <Typography variant="mono" style={styles.motivationText}>
                  "DISCIPLINE IS THE BRIDGE BETWEEN{'\n'}GOALS AND ACCOMPLISHMENT"
                </Typography>
              </View>
            </SlideContent>
          </View>

        </PagerView>

        {/* ── Footer ─────────────────────────── */}
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
            onPress={goNext}
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
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRUTALIST_THEME.colors.background,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  brandTitle: {
    fontSize: 36,
    lineHeight: 40,
    color: BRUTALIST_THEME.colors.text,
    letterSpacing: -1,
  },
  brandSubtitle: {
    color: BRUTALIST_THEME.colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 1.5,
  },

  // Pager
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  slideOuter: {
    flex: 1,
    justifyContent: 'center',
  },
  slideInner: {
    paddingHorizontal: 24,
  },

  // Welcome Slide
  welcomeEmoji: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  emojiText: {
    fontSize: 48,
  },

  // Slide Content
  slideTitle: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 8,
    color: BRUTALIST_THEME.colors.text,
  },
  slideDescription: {
    color: BRUTALIST_THEME.colors.textMuted,
    lineHeight: 22,
    marginBottom: 16,
    fontSize: 14,
  },

  // Concept Cards (Slide 0)
  conceptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  conceptIcon: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  conceptText: {
    flex: 1,
  },

  // Habit Preview (Slide 1)
  previewContainer: {
    gap: 4,
  },
  habitPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  habitPreviewText: {
    flex: 1,
    gap: 2,
  },
  checkboxDone: {
    width: 26,
    height: 26,
    borderWidth: 2.5,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: 3,
    backgroundColor: BRUTALIST_THEME.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 14,
    lineHeight: 16,
    color: '#000',
  },
  checkboxPending: {
    width: 26,
    height: 26,
    borderWidth: 2.5,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  doneText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: BRUTALIST_THEME.colors.textMuted,
  },

  // Progress bar (Slide 2)
  progressBarBg: {
    height: 14,
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
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressRight: {
    fontWeight: 'bold',
  },

  // Project Preview (Slide 3)
  projectPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeTag: {
    backgroundColor: BRUTALIST_THEME.colors.success + '30',
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1.5,
    borderColor: BRUTALIST_THEME.colors.border,
  },
  activeTagText: {
    fontSize: 9,
    fontWeight: 'bold',
  },

  // Final Slide
  finalEmoji: {
    alignSelf: 'center',
    marginBottom: 4,
  },
  emojiTextLarge: {
    fontSize: 56,
    lineHeight: 72,
  },
  summaryContainer: {
    gap: 4,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  motivationBox: {
    marginTop: 16,
    borderTopWidth: 2,
    borderTopColor: BRUTALIST_THEME.colors.border,
    paddingTop: 12,
  },
  motivationText: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 16,
    color: BRUTALIST_THEME.colors.textMuted,
    letterSpacing: 0.8,
  },

  // Tip box
  tipBox: {
    marginTop: 12,
    backgroundColor: BRUTALIST_THEME.colors.paper,
    borderWidth: 1.5,
    borderColor: BRUTALIST_THEME.colors.border,
    borderStyle: 'dashed',
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tipText: {
    fontSize: 10,
    textAlign: 'center',
    color: BRUTALIST_THEME.colors.textMuted,
  },

  // Pill badge
  pillBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDE9FE',
    borderRadius: 3,
    borderWidth: 2,
    borderColor: BRUTALIST_THEME.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  pillText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  pageCounter: {
    textAlign: 'center',
    fontSize: 10,
    color: BRUTALIST_THEME.colors.textMuted,
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'underline',
  },
});
