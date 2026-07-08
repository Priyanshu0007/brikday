 
'use no memo';
import React, { useRef, useState, useCallback } from 'react';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import PagerView, { PagerViewOnPageScrollEvent, PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { appActions, OnboardingV2Config } from '@/state/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { ONBOARDING_HABIT_OPTIONS, OnboardingHabitOption } from '@/state/hardcoded-data/onboarding-habits';
import { TOTAL_SLIDES } from './constants';
import { styles } from './styles';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingFooter } from './OnboardingFooter';
import { WelcomeSlide } from './WelcomeSlide';
import { ProfileSlide } from './ProfileSlide';
import { HabitPickerSlide } from './HabitPickerSlide';
import { ThemeSlide } from './ThemeSlide';
import { NotificationSlide } from './NotificationSlide';

export function OnboardingScreen() {
  useUnistyles();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const activeIndex = useSharedValue(0);

  // ── Flow state ──────────────────────────
  const [username, setUsername] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('🧱');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [selectedHabitKeys, setSelectedHabitKeys] = useState<string[]>([]);
  const [customHabits, setCustomHabits] = useState<{ title: string; emoji: string }[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(7);
  const [reminderMinute, setReminderMinute] = useState(0);
  const [validationError, setValidationError] = useState('');

  // ── Callbacks ───────────────────────────
  const onPageScroll = useCallback((e: PagerViewOnPageScrollEvent) => {
    const { position, offset } = e.nativeEvent;
    // eslint-disable-next-line react-hooks/immutability
    activeIndex.value = position + offset;
  }, [activeIndex]);

  const onPageSelected = useCallback((e: PagerViewOnPageSelectedEvent) => {
    setCurrentPage(e.nativeEvent.position);
    setValidationError('');
  }, []);

  const toggleHabit = useCallback((key: string) => {
    setSelectedHabitKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  }, []);

  const addCustomHabit = useCallback((title: string, emoji: string) => {
    setCustomHabits((prev) => [...prev, { title, emoji }]);
  }, []);

  const removeCustomHabit = useCallback((index: number) => {
    setCustomHabits((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleTimeChange = useCallback((hour: number, minute: number) => {
    setReminderHour(hour);
    setReminderMinute(minute);
  }, []);

  // ── Validation ──────────────────────────
  const validateCurrentPage = (): boolean => {
    switch (currentPage) {
      case 1: // Profile
        if (!username.trim()) {
          setValidationError('Please enter your name to continue');
          return false;
        }
        return true;
      case 2: // Habits
        if (selectedHabitKeys.length + customHabits.length < 3) {
          setValidationError(`Pick at least 3 habits (${selectedHabitKeys.length + customHabits.length}/3)`);
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // ── Navigation ──────────────────────────
  const goNext = async () => {
    if (!validateCurrentPage()) return;
    setValidationError('');

    if (currentPage < TOTAL_SLIDES - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      // Final slide — complete onboarding
      const selectedHabits: OnboardingHabitOption[] = selectedHabitKeys
        .map((key) => ONBOARDING_HABIT_OPTIONS.find((h) => h.key === key))
        .filter((h): h is OnboardingHabitOption => h !== undefined);

      const config: OnboardingV2Config = {
        username,
        avatarEmoji,
        currencyCode,
        selectedHabits,
        customHabits,
        theme: selectedTheme,
        notificationsEnabled,
        morningReminderHour: reminderHour,
        morningReminderMinute: reminderMinute,
      };

      await appActions.completeOnboardingV2(config);
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
            <ProfileSlide
              activeIndex={activeIndex}
              username={username}
              onUsernameChange={setUsername}
              avatarEmoji={avatarEmoji}
              onAvatarChange={setAvatarEmoji}
              currencyCode={currencyCode}
              onCurrencyChange={setCurrencyCode}
            />
          </View>
          <View key="2" style={styles.page}>
            <HabitPickerSlide
              activeIndex={activeIndex}
              selectedKeys={selectedHabitKeys}
              onToggleHabit={toggleHabit}
              customHabits={customHabits}
              onAddCustomHabit={addCustomHabit}
              onRemoveCustomHabit={removeCustomHabit}
            />
          </View>
          <View key="3" style={styles.page}>
            <ThemeSlide
              activeIndex={activeIndex}
              selectedTheme={selectedTheme}
              onThemeChange={setSelectedTheme}
            />
          </View>
          <View key="4" style={styles.page}>
            <NotificationSlide
              activeIndex={activeIndex}
              notificationsEnabled={notificationsEnabled}
              onToggleNotifications={setNotificationsEnabled}
              reminderHour={reminderHour}
              reminderMinute={reminderMinute}
              onTimeChange={handleTimeChange}
            />
          </View>
        </PagerView>

        <OnboardingFooter
          currentPage={currentPage}
          activeIndex={activeIndex}
          onNext={goNext}
          validationError={validationError}
        />
      </View>
    </SafeAreaView>
  );
}
