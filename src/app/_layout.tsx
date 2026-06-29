import '@/unistyles';
import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { useColorScheme, AppState, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import { useUnistyles, UnistylesRuntime } from 'react-native-unistyles';
import { observer } from '@legendapp/state/react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setupDevMenu } from '@/state/devtool';
import { migrateToLogSystem } from '@/state/migration';
import { appActions, uiState$ } from '@/state/store';
import * as Notifications from 'expo-notifications';
import { requestNotificationPermissions } from '@/utils/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default observer(function TabLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useUnistyles();
  const userTheme = uiState$.theme.get() || 'system';

  useEffect(() => {
    // Dynamically apply selected theme configuration to Unistyles
    const activeTheme =
      userTheme === 'system' ? (colorScheme === 'dark' ? 'dark' : 'light') : userTheme;

    if (UnistylesRuntime.themeName !== activeTheme) {
      UnistylesRuntime.setTheme(activeTheme);
    }
  }, [userTheme, colorScheme]);

  useEffect(() => {
    if (__DEV__) {
      setupDevMenu();
    }

    // Run one-time migration and init daily log
    migrateToLogSystem();
    appActions.loadTodayLog();

    // Request notification permissions and reschedule
    (async () => {
      const granted = await requestNotificationPermissions();
      if (granted) {
        appActions.rescheduleNotifications();
      }
    })();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
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
        <StatusBar
          barStyle={theme.colors.background === '#FFFFFF' ? 'dark-content' : 'light-content'}
          backgroundColor={theme.colors.background}
        />
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
});
