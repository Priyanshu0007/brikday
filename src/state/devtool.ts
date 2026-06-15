import { DevSettings } from 'react-native';
import { authState$ } from './slices/authSlice';
import { userState$ } from './slices/userSlice';
import { habitTemplates$ } from './slices/habitsSlice';
import { vaultState$ } from './slices/vaultSlice';
import { blueprintState$ } from './slices/blueprintSlice';
import { uiState$ } from './slices/uiSlice';
import { statsState$ } from './slices/statsSlice';
import { todayLog$, logIndex$, mmkvStorage } from './slices/dailyLogSlice';
import { initialProjects } from './hardcoded-data/blueprint';
import { initialVaultGoals } from './hardcoded-data/vault';
import { getLocalDateString } from '@/utils/date';

/**
 * Resets all MMKV persistent storage and in-memory states to initial defaults,
 * then reloads the application bundle.
 */
export const resetAppAndStorage = () => {
  try {
    // 1. Clear MMKV persistent storage
    mmkvStorage.clearAll();

    // 2. Reset Legend State observables in memory to defaults
    authState$.set({ status: 'onboarding' });
    userState$.set({
      username: 'SDE-1, React Native',
      role: 'Core Architect',
      isLoggedIn: false,
    });
    statsState$.set({ streak: 12 });
    habitTemplates$.set([]);
    todayLog$.set(null);
    logIndex$.set([]);
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
 * Resets the current day's log so the "Start New Day" banner can be tested.
 */
export const resetCurrentDay = () => {
  try {
    const todayStr = getLocalDateString();
    mmkvStorage.remove(`log:${todayStr}`);
    todayLog$.set(null);
    console.log('[DevTool] Reset current day log.');
  } catch (error) {
    console.error('[DevTool] Failed to reset current day:', error);
  }
};

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
      DevSettings.addMenuItem('Reset Current Day', () => {
        resetCurrentDay();
      });
      console.log('[DevTool] Registered "Reset App & Storage" and "Reset Current Day" in DevSettings.');
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
        {
          name: 'Reset Current Day',
          callback: () => {
            resetCurrentDay();
          },
        },
      ]);
      console.log('[DevTool] Registered "Reset App & Storage" and "Reset Current Day" in expo-dev-menu.');
    } catch {
      // expo-dev-menu is not installed or available in this context
      console.log('[DevTool] expo-dev-menu not available or failed to register.');
    }
  }
};
