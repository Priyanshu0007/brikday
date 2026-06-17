import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Typography } from '@/ui/Typography';
import { BrutalistInput } from '@/ui/BrutalistInput';
import { BrutalistButton } from '@/ui/BrutalistButton';
import { appActions } from '@/state/store';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LoginScreen() {
  const [username, setUsername] = useState('SDE-1, React Native');
  const [password, setPassword] = useState('********');

  const { theme } = useUnistyles();

  const handleLogin = () => {
    appActions.login(username);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            {/* Branding Header */}
            <View style={styles.header}>
              <Typography variant="h1" style={styles.title} uppercase>
                LOGIN
              </Typography>
              <Typography variant="mono" style={styles.subtitle}>
                LOGIN TO BRICKDAY
              </Typography>
            </View>

            {/* Stark Credentials Form Card */}
            <View style={styles.formContainer}>
              <View style={styles.securityWarningCard}>
                <Typography variant="mono" style={styles.warningText} color="#FFFFFF">
                  [NOTE]: LOGGING IN STARTS YOUR JOURNEY.
                </Typography>
              </View>

              <BrutalistInput
                label="USERNAME"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username..."
                autoCapitalize="none"
              />

              <BrutalistInput
                label="PASSWORD"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password..."
                secureTextEntry
                autoCapitalize="none"
              />

              <BrutalistButton
                onPress={handleLogin}
                backgroundColor={theme.colors.success}
                style={styles.button}
              >
                LOGIN
              </BrutalistButton>
            </View>

            {/* Bottom disclaimer */}
            <View style={styles.footer}>
              <Typography variant="caption" style={styles.disclaimer}>
                BY LOGGING IN, YOU AGREE TO WORK HARD TOWARDS YOUR GOALS.
              </Typography>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    gap: 12,
  },
  securityWarningCard: {
    backgroundColor: theme.colors.danger,
    borderWidth: theme.borderWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius,
    padding: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 11,
    lineHeight: 15,
  },
  button: {
    marginTop: 12,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 14,
    color: theme.colors.textMuted,
  },
}));
