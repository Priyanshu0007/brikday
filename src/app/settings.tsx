import { SettingsScreen } from '@/components/screens/SettingsScreen';
import { Typography } from '@/ui/Typography';
import { router } from 'expo-router';
import { PressableScale } from 'pressto';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export default function SettingsRoute() {
  const { theme } = useUnistyles();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Back header */}
      <View style={styles.backHeader}>
        {/* @ts-ignore */}
        <PressableScale
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: theme.colors.paper, borderColor: theme.colors.border },
          ]}
        >
          <Typography variant="bodyBold">◀ BACK</Typography>
        </PressableScale>
      </View>

      <SettingsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.paper,
  },
}));
