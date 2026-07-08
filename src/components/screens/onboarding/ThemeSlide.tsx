import React from 'react';
import { View, Pressable } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { Typography } from '@/ui/Typography';
import { useUnistyles, UnistylesRuntime } from 'react-native-unistyles';
import { Colors } from '@/constants/theme';
import { triggerHaptic } from '@/ui/haptics';
import { SlideContent } from './SlideContent';
import { styles } from './styles';

interface ThemeSlideProps {
  activeIndex: SharedValue<number>;
  selectedTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function ThemeSlide({ activeIndex, selectedTheme, onThemeChange }: ThemeSlideProps) {
  const { theme } = useUnistyles();

  const handleThemeSelect = (selected: 'light' | 'dark') => {
    triggerHaptic('selection');
    onThemeChange(selected);
    // Live preview — switch the app theme immediately
    UnistylesRuntime.setTheme(selected);
  };

  return (
    <SlideContent index={3} activeIndex={activeIndex}>
      <Typography variant="h2" style={[styles.slideTitle, { textAlign: 'center' }]}>
        CHOOSE YOUR LOOK
      </Typography>
      <Typography variant="body" style={[styles.slideDescription, { textAlign: 'center' }]}>
        Pick a theme. You can change this anytime in settings.
      </Typography>

      <View style={styles.themeOptionsContainer}>
        {/* Light Theme Card */}
        <Pressable
          onPress={() => handleThemeSelect('light')}
          style={[
            styles.themeCard,
            { backgroundColor: Colors.light.background, borderColor: Colors.light.border },
            selectedTheme === 'light' && styles.themeCardSelected,
          ]}
        >
          <View style={[styles.themeCardHeader, { borderBottomWidth: 2, borderBottomColor: Colors.light.border }]}>
            <Typography
              variant="bodyBold"
              style={styles.themeCardTitle}
              color={Colors.light.text}
            >
              ☀️  LIGHT MODE
            </Typography>
            {selectedTheme === 'light' && (
              <View style={[styles.themeCheckBadge, { borderColor: Colors.light.border }]}>
                <Typography variant="bodyBold" style={{ fontSize: 14 }}>✓</Typography>
              </View>
            )}
          </View>
          <View style={styles.themePreview}>
            <View style={[styles.themePreviewBar, { width: '80%', backgroundColor: Colors.light.success, borderColor: Colors.light.border }]} />
            <View style={[styles.themePreviewBar, { width: '60%', backgroundColor: Colors.light.warning, borderColor: Colors.light.border }]} />
            <View style={[styles.themePreviewBar, { width: '40%', backgroundColor: Colors.light.paper, borderColor: Colors.light.border }]} />
          </View>
        </Pressable>

        {/* Dark Theme Card */}
        <Pressable
          onPress={() => handleThemeSelect('dark')}
          style={[
            styles.themeCard,
            { backgroundColor: Colors.dark.background, borderColor: Colors.dark.border },
            selectedTheme === 'dark' && [styles.themeCardSelected, { borderColor: Colors.dark.success }],
          ]}
        >
          <View style={[styles.themeCardHeader, { borderBottomWidth: 2, borderBottomColor: Colors.dark.border }]}>
            <Typography
              variant="bodyBold"
              style={styles.themeCardTitle}
              color={Colors.dark.text}
            >
              🌙  DARK MODE
            </Typography>
            {selectedTheme === 'dark' && (
              <View style={[styles.themeCheckBadge, { backgroundColor: Colors.dark.success, borderColor: Colors.dark.border }]}>
                <Typography variant="bodyBold" style={{ fontSize: 14 }} color={Colors.dark.background}>✓</Typography>
              </View>
            )}
          </View>
          <View style={styles.themePreview}>
            <View style={[styles.themePreviewBar, { width: '80%', backgroundColor: Colors.dark.success, borderColor: Colors.dark.border }]} />
            <View style={[styles.themePreviewBar, { width: '60%', backgroundColor: Colors.dark.warning, borderColor: Colors.dark.border }]} />
            <View style={[styles.themePreviewBar, { width: '40%', backgroundColor: Colors.dark.paper, borderColor: Colors.dark.border }]} />
          </View>
        </Pressable>
      </View>

      <View style={styles.tipBox}>
        <Typography variant="mono" style={styles.tipText}>
          THEME PREVIEW IS LIVE — LOOK AROUND!
        </Typography>
      </View>
    </SlideContent>
  );
}
