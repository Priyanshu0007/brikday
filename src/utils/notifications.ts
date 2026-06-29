import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') return false;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

export async function cancelAllScheduled() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleMorningReminder(hour: number, minute: number) {
  if (Platform.OS === 'web') return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🧱 Time to build.',
      body: "Let's go. Check your habits for today.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function scheduleEveningRecap(hour: number, minute: number) {
  if (Platform.OS === 'web') return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📊 Day complete',
      body: 'Did you finish your habits? Log them now.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function scheduleStreakAlert() {
  if (Platform.OS === 'web') return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔥 Streak at risk!',
      body: 'Your streak is at risk! Open Brikday to stay on track.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 21,
      minute: 30, // Default time for streak alert
    },
  });
}
