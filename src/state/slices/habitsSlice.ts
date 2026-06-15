import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { mmkvPlugin } from '../plugin';
import { HabitTemplate } from '../types';
import { initialHabits } from '../hardcoded-data/habits';

export const habitTemplates$ = observable<HabitTemplate[]>(initialHabits);
syncObservable(habitTemplates$, { persist: { name: 'habitTemplates', plugin: mmkvPlugin } });
