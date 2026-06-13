import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { mmkvPlugin } from '../plugin';
import { Habit } from '../types';
import { initialHabits } from '../hardcoded-data/habits';

export const habitsState$ = observable<Habit[]>(initialHabits);
syncObservable(habitsState$, { persist: { name: 'habitsState', plugin: mmkvPlugin } });
