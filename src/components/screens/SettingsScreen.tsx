import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { router } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { userState$, statsState$, appActions } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';

export const SettingsScreen = observer(function SettingsScreen() {
  const user = userState$.get();
  const stats = statsState$.get();
  
  // Sheet visible state
  const [sheetType, setSheetType] = useState<'profile' | null>(null);

  // Form local states
  const [profileName, setProfileName] = useState(user.username);
  const [profileRole, setProfileRole] = useState(user.role);



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


  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.header}>
          <Typography variant="h2" uppercase>
            SETTINGS
          </Typography>
          <Typography variant="mono" style={styles.subtitle}>
            ACCOUNT INFO
          </Typography>
        </View>

        {/* Profile Card */}
        <BrutalistCard backgroundColor={BRUTALIST_THEME.colors.warning}>
          <View style={styles.profileRow}>
            <View style={styles.avatarPlaceholder}>
              <Typography variant="h2">[O]</Typography>
            </View>
            <View style={styles.profileDetails}>
              <Typography variant="h3" uppercase>{user.username}</Typography>
              <Typography variant="mono" style={styles.profileRoleText}>
                {user.role}
              </Typography>
              <Typography variant="bodyBold" style={styles.streakCount}>
                🔥 STREAK: {stats.streak} DAYS
              </Typography>
            </View>
          </View>
        </BrutalistCard>

        {/* Action List Section */}
        <Typography variant="bodyBold" style={styles.sectionTitle} uppercase>
          ACCOUNT OPTIONS
        </Typography>

        <View style={styles.actionList}>
          {/* Action 1: Edit Profile */}
          <BrutalistCard backgroundColor="#FFFFFF">
            <View style={styles.actionItem}>
              <View style={styles.actionTextWrapper}>
                <Typography variant="bodyBold">YOUR PROFILE</Typography>
                <Typography variant="caption">Change your name and bio</Typography>
              </View>
              <BrutalistButton
                onPress={() => handleOpenSheet('profile')}
                backgroundColor={BRUTALIST_THEME.colors.paper}
                size="sm"
                style={styles.actionBtn}
              >
                EDIT
              </BrutalistButton>
            </View>
          </BrutalistCard>

          {/* Action 2: Database Editor */}
          <BrutalistCard backgroundColor="#FFFFFF">
            <View style={styles.actionItem}>
              <View style={styles.actionTextWrapper}>
                <Typography variant="bodyBold">YOUR DATA</Typography>
                <Typography variant="caption">Edit Habits, Savings, Projects</Typography>
              </View>
              <BrutalistButton
                onPress={() => router.push('/editor')}
                backgroundColor={BRUTALIST_THEME.colors.paper}
                size="sm"
                style={styles.actionBtn}
              >
                OPEN
              </BrutalistButton>
            </View>
          </BrutalistCard>
        </View>

        {/* Emergency Logout */}
        <BrutalistButton
          onPress={() => appActions.logout()}
          backgroundColor={BRUTALIST_THEME.colors.danger}
          style={styles.logoutButton}
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
        <View style={styles.form}>
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
            backgroundColor={BRUTALIST_THEME.colors.success}
            style={styles.submitBtn}
          >
            SAVE CHANGES
          </BrutalistButton>
        </View>
      </BrutalistBottomSheet>

    </View>
  );
});

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
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
    color: BRUTALIST_THEME.colors.textMuted,
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
    backgroundColor: '#FFFFFF',
    borderWidth: BRUTALIST_THEME.borderWidth,
    borderColor: BRUTALIST_THEME.colors.border,
    borderRadius: BRUTALIST_THEME.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetails: {
    flex: 1,
  },
  profileRoleText: {
    fontSize: 12,
    color: '#000000',
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
});
