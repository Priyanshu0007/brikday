import React from 'react';
import { View, StatusBar } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { router } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { userState$, uiState$, authState$, statsState$ } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { OnboardingScreen } from '@/components/screens/onboarding';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LoginScreen } from '@/components/screens/LoginScreen';
import { HabitsScreen } from '@/components/screens/HabitsScreen';
import { VaultScreen } from '@/components/screens/vault';
import { BlueprintScreen } from '@/components/screens/BlueprintScreen';
import { AnalyticsScreen } from '@/components/screens/AnalyticsScreen';
import { PressableScale } from 'pressto';
import { triggerHaptic } from '@/ui/haptics';

const DashboardHeader = observer(() => {
  const user = userState$.get();
  const stats = statsState$.get();
  
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
            style={styles.profileButton}
            // @ts-ignore
            activeScale={0.9}
          >
            <Typography variant="bodyBold" style={styles.profileIcon}>👤</Typography>
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
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <DashboardHeader />

      {/* Screen Area */}
      <View style={styles.screenArea}>
        {renderActiveScreen()}
      </View>

      {/* Stark Neo-Brutalist Tab Bar */}
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <PressableScale
              key={tab.id}
              onPress={() => handleTabPress(tab.id)}
              style={[
                styles.tabButton,
                isActive && styles.tabButtonActive,
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BRUTALIST_THEME.colors.background,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: BRUTALIST_THEME.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    borderBottomWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: BRUTALIST_THEME.colors.warning,
    borderWidth: 2,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
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
    borderWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
    backgroundColor: BRUTALIST_THEME.colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 18,
  },
  headerSub: {
    marginTop: 2,
    fontSize: 9,
    fontFamily: BRUTALIST_THEME.fonts.mono,
  },
  screenArea: {
    flex: 1,
    backgroundColor: BRUTALIST_THEME.colors.paper,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: BRUTALIST_THEME.borderRadius,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tabButtonActive: {
    backgroundColor: BRUTALIST_THEME.colors.paper,
    borderWidth: 2,
    borderColor: BRUTALIST_THEME.colors.border,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 9,
    fontFamily: BRUTALIST_THEME.fonts.heading,
    fontWeight: 'bold',
    color: BRUTALIST_THEME.colors.textMuted,
  },
  tabLabelActive: {
    color: BRUTALIST_THEME.colors.text,
  },
});
