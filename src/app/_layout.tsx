import '@/unistyles';
import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { useColorScheme, AppState } from 'react-native';
import { useFonts } from 'expo-font';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { PlusJakartaSans_400Regular, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setupDevMenu } from '@/state/devtool';
import { migrateToLogSystem } from '@/state/migration';
import { appActions } from '@/state/store';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (__DEV__) {
      setupDevMenu();
    }
    
    // Run one-time migration and init daily log
    migrateToLogSystem();
    appActions.loadTodayLog();
    
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        appActions.loadTodayLog();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  const [loaded, error] = useFonts({
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'SpaceMono-Regular': SpaceMono_400Regular,
  });

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
