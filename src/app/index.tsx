import { OnboardingScreen } from '@/components/screens/onboarding';
import { authState$, statsState$, uiState$, userState$ } from '@/state/store';
import { Typography } from '@/ui/Typography';
import { observer } from '@legendapp/state/react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AnalyticsScreen } from '@/components/screens/AnalyticsScreen';
import { BlueprintScreen } from '@/components/screens/BlueprintScreen';
import { HabitsScreen } from '@/components/screens/HabitsScreen';
import { VaultScreen } from '@/components/screens/vault';
import { triggerHaptic } from '@/ui/haptics';
import { PressableScale } from 'pressto';

const DashboardHeader = observer(() => {
  const user = userState$.get();
  const stats = statsState$.get();
  const { theme } = useUnistyles();

  return (
    <View style={styles.header}>
      <View style={styles.headerTitleRow}>
        <Typography variant="h2" uppercase style={styles.headerLogo}>
          BRICKDAY
        </Typography>
        <View style={styles.headerRightRow}>
          <View style={styles.streakBadge}>
            <Typography variant="mono" style={styles.streakText}>
              🔥 {stats.streak}D STREAK
            </Typography>
          </View>
          <PressableScale
            onPress={() => {
              triggerHaptic('selection');
              router.push('/settings');
            }}
            style={[styles.profileButton, { backgroundColor: theme.colors.paper, borderColor: theme.colors.border }]}
            // @ts-ignore
            activeScale={0.9}
          >
            <Typography variant="bodyBold" style={[styles.profileIcon, { color: theme.colors.text }]}>👤</Typography>
          </PressableScale>
        </View>
      </View>
      <Typography variant="caption" style={styles.headerSub}>
        {`USER: ${user.username.toUpperCase()} // ONLINE`}
      </Typography>
    </View>
  );
});

const AppDashboard = observer(() => {
  const activeTab = uiState$.activeTab.get();
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'engine':
        return <HabitsScreen />;
      case 'vault':
        return <VaultScreen />;
      case 'blueprint':
        return <BlueprintScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      default:
        return <HabitsScreen />;
    }
  };

  const handleTabPress = (tabId: typeof activeTab) => {
    triggerHaptic('selection');
    uiState$.activeTab.set(tabId);
  };

  const tabs = [
    { id: 'engine', label: 'HABITS', icon: '⚡' },
    { id: 'vault', label: 'SAVINGS', icon: '🪙' },
    { id: 'blueprint', label: 'PROJECTS', icon: '🧱' },
    { id: 'analytics', label: 'ANALYTICS', icon: '📊' },
  ] as const;

  return (
    <SafeAreaView style={styles.dashboardContainer} edges={['top', 'left', 'right']}>
      {/* Header */}
      <DashboardHeader />

      {/* Screen Area */}
      <View style={styles.screenArea}>
        {renderActiveScreen()}
      </View>

      {/* Stark Neo-Brutalist Tab Bar */}
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8), backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <PressableScale
              key={tab.id}
              onPress={() => handleTabPress(tab.id)}
              style={[
                styles.tabButton,
                isActive && [styles.tabButtonActive, { backgroundColor: theme.colors.paper, borderColor: theme.colors.border }],
              ]}
              // @ts-ignore
              activeScale={0.93}
            >
              <Typography variant="mono" style={styles.tabIcon}>
                {tab.icon}
              </Typography>
              <Typography
                variant="caption"
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Typography>
            </PressableScale>
          );
        })}
      </View>
    </SafeAreaView>
  );
});

export default observer(function HomeScreen() {
  const status = authState$.status.get();
  useUnistyles();

  const renderContent = () => {
    switch (status) {
      case 'onboarding':
        return <OnboardingScreen />;
      case 'login':
        // return <LoginScreen />;
        return <AppDashboard />;
      case 'authenticated':
      default:
        return <AppDashboard />;
    }
  };

  return (
    <View style={styles.root}>
      {renderContent()}
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    borderBottomWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLogo: {
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  streakBadge: {
    backgroundColor: theme.colors.warning,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  streakText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 18,
    lineHeight: 22,
  },
  headerSub: {
    marginTop: 2,
    fontSize: 9,
    fontFamily: theme.fonts.mono,
  },
  screenArea: {
    flex: 1,
    backgroundColor: theme.colors.paper,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: theme.borderRadius,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.paper,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  tabIcon: {
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 9,
    fontFamily: theme.fonts.heading,
    fontWeight: 'bold',
    color: theme.colors.textMuted,
  },
  tabLabelActive: {
    color: theme.colors.text,
  },
}));
