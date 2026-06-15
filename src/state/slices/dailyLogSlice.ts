import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { mmkvPlugin } from '../plugin';
import { DailyLog } from '../types';
import { createMMKV } from 'react-native-mmkv';

export const todayLog$ = observable<DailyLog | null>(null);

export const logIndex$ = observable<string[]>([]);
syncObservable(logIndex$, { persist: { name: 'logIndex', plugin: mmkvPlugin } });

export const mmkvStorage = createMMKV({ id: 'brikday-storage' });
