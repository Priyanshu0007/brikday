import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { mmkvPlugin } from '../plugin';
import { UserProfile } from '../types';

export const userState$ = observable<UserProfile>({
  username: 'SDE-1, React Native',
  role: 'Core Architect',
  isLoggedIn: false,
  currencyCode: 'USD',
});
syncObservable(userState$, { persist: { name: 'userState', plugin: mmkvPlugin } });
