import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressableScale } from 'pressto';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { SettingsScreen } from '@/components/screens/SettingsScreen';

export default function SettingsRoute() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Back header */}
      <View style={styles.backHeader}>
        {/* @ts-ignore */}
        <PressableScale onPress={() => router.back()} style={styles.backButton} activeScale={0.9}>
          <Typography variant="bodyBold">◀ BACK</Typography>
        </PressableScale>
      </View>

      <SettingsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRUTALIST_THEME.colors.background,
  },
  backHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    alignSelf: 'flex-start',
    borderWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: BRUTALIST_THEME.colors.paper,
  },
});
