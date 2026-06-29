import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { mmkvPlugin } from '../plugin';
import { NotificationPreferences } from '../types';

export const notificationState$ = observable<NotificationPreferences>({
  morningReminder: { enabled: false, hour: 7, minute: 0 },
  eveningRecap: { enabled: false, hour: 20, minute: 0 },
  streakAlert: { enabled: false },
});

syncObservable(notificationState$, {
  persist: { name: 'notificationPrefs', plugin: mmkvPlugin },
});
