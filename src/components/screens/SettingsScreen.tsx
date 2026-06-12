import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { observer } from '@legendapp/state/react';
import { appState$, appActions } from '@/state/store';
import { BRUTALIST_THEME } from '@/ui/theme';
import { Typography } from '@/ui/Typography';
import { BrutalistCard } from '@/ui/BrutalistCard';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { BrutalistBottomSheet } from '@/ui/BrutalistBottomSheet';

export const SettingsScreen = observer(function SettingsScreen() {
  const user = appState$.user.get();
  
  // Sheet visible state
  const [sheetType, setSheetType] = useState<'profile' | 'vault' | 'habit' | null>(null);

  // Form local states
  const [profileName, setProfileName] = useState(user.username);
  const [profileRole, setProfileRole] = useState(user.role);

  const [vaultTitle, setVaultTitle] = useState('');
  const [vaultTarget, setVaultTarget] = useState('');

  const [habitTitle, setHabitTitle] = useState('');

  const handleOpenSheet = (type: 'profile' | 'vault' | 'habit') => {
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

  const handleAddVaultGoal = () => {
    const targetVal = parseFloat(vaultTarget);
    if (vaultTitle.trim() && !isNaN(targetVal)) {
      appActions.addVaultGoal(vaultTitle, targetVal);
      setVaultTitle('');
      setVaultTarget('');
      setSheetType(null);
    }
  };

  const handleAddHabit = () => {
    if (habitTitle.trim()) {
      appActions.addHabit(habitTitle);
      setHabitTitle('');
      setSheetType(null);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.header}>
          <Typography variant="h2" uppercase>
            CONTROL CENTER
          </Typography>
          <Typography variant="mono" style={styles.subtitle}>
            SYSTEM PREFERENCES & METRICS
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
                🔥 STREAK: {user.streak} DAYS
              </Typography>
            </View>
          </View>
        </BrutalistCard>

        {/* Action List Section */}
        <Typography variant="bodyBold" style={styles.sectionTitle} uppercase>
          SYSTEM ACTIONS
        </Typography>

        <View style={styles.actionList}>
          {/* Action 1: Edit Profile */}
          <BrutalistCard backgroundColor="#FFFFFF">
            <View style={styles.actionItem}>
              <View style={styles.actionTextWrapper}>
                <Typography variant="bodyBold">OPERATOR ATTRIBUTES</Typography>
                <Typography variant="caption">Modify username & title roles</Typography>
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

          {/* Action 2: Add Vault Goal */}
          <BrutalistCard backgroundColor="#FFFFFF">
            <View style={styles.actionItem}>
              <View style={styles.actionTextWrapper}>
                <Typography variant="bodyBold">ALLOCATE VAULT DEPOSIT</Typography>
                <Typography variant="caption">Establish new zero-debt goals</Typography>
              </View>
              <BrutalistButton
                onPress={() => handleOpenSheet('vault')}
                backgroundColor={BRUTALIST_THEME.colors.paper}
                size="sm"
                style={styles.actionBtn}
              >
                CREATE
              </BrutalistButton>
            </View>
          </BrutalistCard>

          {/* Action 3: Add Habit */}
          <BrutalistCard backgroundColor="#FFFFFF">
            <View style={styles.actionItem}>
              <View style={styles.actionTextWrapper}>
                <Typography variant="bodyBold">INJECT HABIT SCHEME</Typography>
                <Typography variant="caption">Add custom Engine instruction</Typography>
              </View>
              <BrutalistButton
                onPress={() => handleOpenSheet('habit')}
                backgroundColor={BRUTALIST_THEME.colors.paper}
                size="sm"
                style={styles.actionBtn}
              >
                CREATE
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
          LOGOUT FROM SYSTEM
        </BrutalistButton>
      </ScrollView>

      {/* Profile Edit Sheet */}
      <BrutalistBottomSheet
        visible={sheetType === 'profile'}
        onClose={() => setSheetType(null)}
        title="EDIT ATTRIBUTES"
      >
        <View style={styles.form}>
          <BrutalistInput
            label="OPERATOR USERNAME"
            value={profileName}
            onChangeText={setProfileName}
            placeholder="Change username..."
          />
          <BrutalistInput
            label="OPERATOR SYSTEM ROLE"
            value={profileRole}
            onChangeText={setProfileRole}
            placeholder="Change role/title..."
          />
          <BrutalistButton
            onPress={handleSaveProfile}
            backgroundColor={BRUTALIST_THEME.colors.success}
            style={styles.submitBtn}
          >
            COMMIT CHANGES
          </BrutalistButton>
        </View>
      </BrutalistBottomSheet>

      {/* Add Vault Goal Sheet */}
      <BrutalistBottomSheet
        visible={sheetType === 'vault'}
        onClose={() => setSheetType(null)}
        title="NEW VAULT TARGET"
      >
        <View style={styles.form}>
          <BrutalistInput
            label="GOAL DESCRIPTION"
            value={vaultTitle}
            onChangeText={setVaultTitle}
            placeholder="e.g. M4 MACBOOK PRO"
          />
          <BrutalistInput
            label="TARGET FUNDING LIMIT ($)"
            value={vaultTarget}
            onChangeText={setVaultTarget}
            keyboardType="numeric"
            placeholder="e.g. 3500"
          />
          <BrutalistButton
            onPress={handleAddVaultGoal}
            backgroundColor={BRUTALIST_THEME.colors.success}
            style={styles.submitBtn}
          >
            ESTABLISH VAULT GOAL
          </BrutalistButton>
        </View>
      </BrutalistBottomSheet>

      {/* Add Habit Sheet */}
      <BrutalistBottomSheet
        visible={sheetType === 'habit'}
        onClose={() => setSheetType(null)}
        title="NEW INSTRUCTION"
      >
        <View style={styles.form}>
          <BrutalistInput
            label="DAILY HABIT STATEMENT"
            value={habitTitle}
            onChangeText={setHabitTitle}
            placeholder="e.g. DRINK 3L WATER"
          />
          <BrutalistButton
            onPress={handleAddHabit}
            backgroundColor={BRUTALIST_THEME.colors.success}
            style={styles.submitBtn}
          >
            INJECT HABIT
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
    paddingVertical: 10,
  },
  submitBtn: {
    marginTop: 16,
  },
});
