import React, { useState } from 'react';
import { View, ScrollView, LayoutAnimation, UIManager, Platform, Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { router } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { userState$, statsState$, appActions, uiState$ } from '@/state/store';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const THEME_OPTIONS = [
  { label: 'System', value: 'system' as const },
  { label: 'Light', value: 'light' as const },
  { label: 'Dark', value: 'dark' as const },
];

export const SettingsScreen = observer(function SettingsScreen() {
  const user = userState$.get();
  const stats = statsState$.get();
  const { theme } = useUnistyles();
  
  // Sheet visible state
  const [sheetType, setSheetType] = useState<'profile' | null>(null);

  // Form local states
  const [profileName, setProfileName] = useState(user.username);
  const [profileRole, setProfileRole] = useState(user.role);

  // Accordion state
  const [themeAccordionOpen, setThemeAccordionOpen] = useState(false);

  const handleOpenSheet = (type: 'profile') => {
    setSheetType(type);
    // Sync initial states
    if (type === 'profile') {
      setProfileName(user.username);
      setProfileRole(user.role);
    }
  };

  const handleSaveProfile = () => {
    appActions.updateProfile(profileName, profileRole);
    setSheetType(null);
  };

  const toggleThemeAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setThemeAccordionOpen(!themeAccordionOpen);
  };

  const selectTheme = (newTheme: 'light' | 'dark' | 'system') => {
    uiState$.theme.set(newTheme);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setThemeAccordionOpen(false);
  };

  const currentTheme = uiState$.theme.get() || 'system';

  return (
    <View style={stylesheet.outerContainer}>
      <ScrollView style={stylesheet.container} contentContainerStyle={stylesheet.scrollContent}>
        {/* Title */}
        <View style={stylesheet.header}>
          <Typography variant="h2" uppercase>
            SETTINGS
          </Typography>
          <Typography variant="mono" style={stylesheet.subtitle}>
            ACCOUNT INFO
          </Typography>
        </View>

        {/* Profile Card */}
        <BrutalistCard backgroundColor={theme.colors.warning}>
          <View style={stylesheet.profileRow}>
            <View style={stylesheet.avatarPlaceholder}>
              <Typography variant="h2">[O]</Typography>
            </View>
            <View style={stylesheet.profileDetails}>
              <Typography variant="h3" uppercase>{user.username}</Typography>
              <Typography variant="mono" style={stylesheet.profileRoleText}>
                {user.role}
              </Typography>
              <Typography variant="bodyBold" style={stylesheet.streakCount}>
                🔥 STREAK: {stats.streak} DAYS
              </Typography>
            </View>
          </View>
        </BrutalistCard>

        {/* Action List Section */}
        <Typography variant="bodyBold" style={stylesheet.sectionTitle} uppercase>
          ACCOUNT OPTIONS
        </Typography>

        <View style={stylesheet.actionList}>
          {/* Action 1: Edit Profile */}
          <BrutalistCard backgroundColor={theme.colors.background}>
            <View style={stylesheet.actionItem}>
              <View style={stylesheet.actionTextWrapper}>
                <Typography variant="bodyBold">YOUR PROFILE</Typography>
                <Typography variant="caption">Change your name and bio</Typography>
              </View>
              <BrutalistButton
                onPress={() => handleOpenSheet('profile')}
                backgroundColor={theme.colors.paper}
                size="sm"
                style={stylesheet.actionBtn}
              >
                EDIT
              </BrutalistButton>
            </View>
          </BrutalistCard>

          {/* Action 2: Database Editor */}
          <BrutalistCard backgroundColor={theme.colors.background}>
            <View style={stylesheet.actionItem}>
              <View style={stylesheet.actionTextWrapper}>
                <Typography variant="bodyBold">YOUR DATA</Typography>
                <Typography variant="caption">Edit Habits, Savings, Projects</Typography>
              </View>
              <BrutalistButton
                onPress={() => router.push('/editor')}
                backgroundColor={theme.colors.paper}
                size="sm"
                style={stylesheet.actionBtn}
              >
                OPEN
              </BrutalistButton>
            </View>
          </BrutalistCard>
        </View>

        {/* App Preferences */}
        <Typography variant="bodyBold" style={stylesheet.sectionTitle} uppercase>
          PREFERENCES
        </Typography>

        <View style={stylesheet.actionList}>
          <BrutalistCard backgroundColor={theme.colors.background}>
            <Pressable onPress={toggleThemeAccordion} style={stylesheet.accordionHeader}>
              <View style={stylesheet.actionTextWrapper}>
                <Typography variant="bodyBold">APPEARANCE</Typography>
                <Typography variant="caption">Current: {THEME_OPTIONS.find(t => t.value === currentTheme)?.label || 'System'}</Typography>
              </View>
              <Typography variant="bodyBold" style={{ fontSize: 20 }}>
                {themeAccordionOpen ? '[-]' : '[+]'}
              </Typography>
            </Pressable>
            
            {themeAccordionOpen && (
              <View style={stylesheet.accordionContent}>
                {THEME_OPTIONS.map((option) => (
                  <Pressable 
                    key={option.value}
                    style={[
                      stylesheet.accordionOption, 
                      currentTheme === option.value && stylesheet.accordionOptionSelected
                    ]}
                    onPress={() => selectTheme(option.value)}
                  >
                    <Typography 
                      variant="bodyBold" 
                      color={currentTheme === option.value ? theme.colors.text : theme.colors.textMuted}
                    >
                      {option.label}
                    </Typography>
                    {currentTheme === option.value && (
                      <Typography variant="bodyBold" color={theme.colors.text}>✓</Typography>
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </BrutalistCard>
        </View>

        {/* Emergency Logout */}
        <BrutalistButton
          onPress={() => appActions.logout()}
          backgroundColor={theme.colors.danger}
          style={stylesheet.logoutButton}
        >
          LOG OUT
        </BrutalistButton>
      </ScrollView>

      {/* Profile Edit Sheet */}
      <BrutalistBottomSheet
        visible={sheetType === 'profile'}
        onClose={() => setSheetType(null)}
        title="EDIT PROFILE"
      >
        <View style={stylesheet.form}>
          <BrutalistInput
            label="USERNAME"
            value={profileName}
            onChangeText={setProfileName}
            placeholder="Change username..."
          />
          <BrutalistInput
            label="BIO / ROLE"
            value={profileRole}
            onChangeText={setProfileRole}
            placeholder="Change bio/role..."
          />
          <BrutalistButton
            onPress={handleSaveProfile}
            backgroundColor={theme.colors.success}
            style={stylesheet.submitBtn}
          >
            SAVE CHANGES
          </BrutalistButton>
        </View>
      </BrutalistBottomSheet>

    </View>
  );
});

const stylesheet = StyleSheet.create((theme) => ({
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120, // Clear bottom tabs
  },
  header: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    backgroundColor: theme.colors.background,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetails: {
    flex: 1,
  },
  profileRoleText: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.8,
    marginTop: 2,
  },
  streakCount: {
    fontSize: 13,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 24,
    marginBottom: 10,
  },
  actionList: {
    gap: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionTextWrapper: {
    flex: 1,
  },
  actionBtn: {
    alignSelf: 'auto',
    minWidth: 100,
  },
  logoutButton: {
    marginTop: 30,
  },
  form: {
    paddingTop: 10,
    paddingBottom: 4,
  },
  submitBtn: {
    marginTop: 16,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionContent: {
    marginTop: 16,
    borderTopWidth: 2,
    borderColor: theme.colors.border,
    paddingTop: 8,
  },
  accordionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  accordionOptionSelected: {
    backgroundColor: theme.colors.paper,
    borderRadius: theme.borderRadius,
  },
}));
