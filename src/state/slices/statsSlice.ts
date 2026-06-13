import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { mmkvPlugin } from '../plugin';
import { StatsProfile } from '../types';

export const statsState$ = observable<StatsProfile>({
  streak: 12,
});
syncObservable(statsState$, { persist: { name: 'statsState', plugin: mmkvPlugin } });
