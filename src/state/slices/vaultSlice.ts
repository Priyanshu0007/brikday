import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { mmkvPlugin } from '../plugin';
import { VaultGoal } from '../types';
import { initialVaultGoals } from '../hardcoded-data/vault';

export const vaultState$ = observable<VaultGoal[]>(initialVaultGoals);
syncObservable(vaultState$, { persist: { name: 'vaultState', plugin: mmkvPlugin } });
