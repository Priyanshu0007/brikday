import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { mmkvPlugin } from '../plugin';
import { AuthState } from '../types';

export const authState$ = observable<AuthState>({ status: 'onboarding' });
syncObservable(authState$, { persist: { name: 'authState', plugin: mmkvPlugin } });
