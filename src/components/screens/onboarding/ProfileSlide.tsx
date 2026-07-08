import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { Typography } from '@/ui/Typography';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { useUnistyles } from 'react-native-unistyles';
import { AVATAR_EMOJI_OPTIONS } from '@/state/hardcoded-data/onboarding-habits';
import { CURRENCY_OPTIONS } from '@/constants/currency';
import { triggerHaptic } from '@/ui/haptics';
import { SlideContent } from './SlideContent';
import { styles } from './styles';

interface ProfileSlideProps {
  activeIndex: SharedValue<number>;
  username: string;
  onUsernameChange: (value: string) => void;
  avatarEmoji: string;
  onAvatarChange: (emoji: string) => void;
  currencyCode: string;
  onCurrencyChange: (code: string) => void;
}

export function ProfileSlide({
  activeIndex,
  username,
  onUsernameChange,
  avatarEmoji,
  onAvatarChange,
  currencyCode,
  onCurrencyChange,
}: ProfileSlideProps) {
  const { theme } = useUnistyles();

  return (
    <SlideContent index={1} activeIndex={activeIndex}>
      <Typography variant="h2" style={styles.slideTitle}>
        WHO'S BUILDING?
      </Typography>
      <Typography variant="body" style={styles.slideDescription}>
        Set up your profile. Pick a name and an avatar.
      </Typography>

      {/* Username Input */}
      <View style={styles.profileSection}>
        <BrutalistInput
          label="YOUR NAME"
          value={username}
          onChangeText={onUsernameChange}
          placeholder="Enter your name..."
          autoCapitalize="words"
          maxLength={30}
        />
      </View>

      {/* Avatar Emoji Picker */}
      <View style={styles.profileSection}>
        <Typography variant="bodyBold" style={styles.sectionLabel} uppercase>
          PICK YOUR AVATAR
        </Typography>
        <View style={styles.avatarGrid}>
          {AVATAR_EMOJI_OPTIONS.map((emoji) => (
            <Pressable
              key={emoji}
              onPress={() => {
                triggerHaptic('selection');
                onAvatarChange(emoji);
              }}
              style={[
                styles.avatarChip,
                avatarEmoji === emoji && styles.avatarChipSelected,
              ]}
            >
              <Typography style={styles.avatarChipEmoji}>{emoji}</Typography>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Currency Selector */}
      <View style={styles.profileSection}>
        <Typography variant="bodyBold" style={styles.sectionLabel} uppercase>
          YOUR CURRENCY
        </Typography>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.currencyRow}
        >
          {CURRENCY_OPTIONS.map((c) => (
            <Pressable
              key={c.value}
              onPress={() => {
                triggerHaptic('selection');
                onCurrencyChange(c.value);
              }}
              style={[
                styles.currencyChip,
                currencyCode === c.value && styles.currencyChipSelected,
              ]}
            >
              <Typography
                variant="bodyBold"
                color={currencyCode === c.value ? theme.colors.background : theme.colors.text}
              >
                {c.label}
              </Typography>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SlideContent>
  );
}
