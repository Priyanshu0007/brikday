/* eslint-disable react-hooks/immutability */
'use no memo';
import React, { useRef, useState, useCallback } from 'react';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import PagerView, { PagerViewOnPageScrollEvent, PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { appActions } from '@/state/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { TOTAL_SLIDES } from './constants';
import { styles } from './styles';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingFooter } from './OnboardingFooter';
import { WelcomeSlide } from './WelcomeSlide';
import { EngineSlide } from './EngineSlide';
import { VaultSlide } from './VaultSlide';
import { BlueprintSlide } from './BlueprintSlide';
import { GetStartedSlide } from './GetStartedSlide';

export function OnboardingScreen() {
  useUnistyles();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const activeIndex = useSharedValue(0);

  const onPageScroll = useCallback((e: PagerViewOnPageScrollEvent) => {
    const { position, offset } = e.nativeEvent;
    activeIndex.value = position + offset;
  }, []);

  const onPageSelected = useCallback((e: PagerViewOnPageSelectedEvent) => {
    setCurrentPage(e.nativeEvent.position);
  }, []);

  const goNext = () => {
    if (currentPage < TOTAL_SLIDES - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      appActions.completeOnboarding();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <OnboardingHeader />

        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageScroll={onPageScroll}
          onPageSelected={onPageSelected}
          overdrag
        >
          <View key="0" style={styles.page}>
            <WelcomeSlide activeIndex={activeIndex} />
          </View>
          <View key="1" style={styles.page}>
            <EngineSlide activeIndex={activeIndex} />
          </View>
          <View key="2" style={styles.page}>
            <VaultSlide activeIndex={activeIndex} />
          </View>
          <View key="3" style={styles.page}>
            <BlueprintSlide activeIndex={activeIndex} />
          </View>
          <View key="4" style={styles.page}>
            <GetStartedSlide activeIndex={activeIndex} />
          </View>
        </PagerView>

        <OnboardingFooter currentPage={currentPage} activeIndex={activeIndex} onNext={goNext} />
      </View>
    </SafeAreaView>
  );
}
