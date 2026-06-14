import { DevSettings } from 'react-native';
import { createMMKV } from 'react-native-mmkv';
import { authState$ } from './slices/authSlice';
import { userState$ } from './slices/userSlice';
import { habitsState$ } from './slices/habitsSlice';
import { vaultState$ } from './slices/vaultSlice';
import { blueprintState$ } from './slices/blueprintSlice';
import { uiState$ } from './slices/uiSlice';
import { statsState$ } from './slices/statsSlice';
import { initialProjects } from './hardcoded-data/blueprint';
import { initialHabits } from './hardcoded-data/habits';
import { initialVaultGoals } from './hardcoded-data/vault';

/**
 * Resets all MMKV persistent storage and in-memory states to initial defaults,
 * then reloads the application bundle.
 */
export const resetAppAndStorage = () => {
  try {
    // 1. Clear MMKV persistent storage
    const storage = createMMKV({ id: 'brikday-storage' });
    storage.clearAll();

    // 2. Reset Legend State observables in memory to defaults
    authState$.set({ status: 'onboarding' });
    userState$.set({
      username: 'SDE-1, React Native',
      role: 'Core Architect',
      isLoggedIn: false,
    });
    statsState$.set({ streak: 12 });
    habitsState$.set(initialHabits);
    vaultState$.set(initialVaultGoals);
    blueprintState$.set(initialProjects);
    uiState$.set({ activeTab: 'engine' });

    // 3. Immediately reload the application bundle
    DevSettings.reload();
  } catch (error) {
    console.error('[DevTool] Failed to reset app and storage:', error);
  }
};

let isDevMenuSetup = false;

/**
 * Registers the "Reset App & Storage" button in the developer menus.
 */
export const setupDevMenu = () => {
  if (__DEV__) {
    if (isDevMenuSetup) return;
    isDevMenuSetup = true;

    try {
      // Register with standard React Native DevSettings
      DevSettings.addMenuItem('Reset App & Storage', () => {
        resetAppAndStorage();
      });
      console.log('[DevTool] Registered "Reset App & Storage" in DevSettings.');
    } catch {
      console.warn('[DevTool] Could not register with DevSettings.');
    }

    try {
      // Register with expo-dev-menu if available
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { registerDevMenuItems } = require('expo-dev-menu');
      registerDevMenuItems([
        {
          name: 'Reset App & Storage',
          callback: () => {
            resetAppAndStorage();
          },
        },
      ]);
      console.log('[DevTool] Registered "Reset App & Storage" in expo-dev-menu.');
    } catch {
      // expo-dev-menu is not installed or available in this context
      console.log('[DevTool] expo-dev-menu not available or failed to register.');
    }
  }
};
