import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { mmkvPlugin } from '../plugin';
import { HabitTemplate } from '../types';

export const habitTemplates$ = observable<HabitTemplate[]>([]);
syncObservable(habitTemplates$, { persist: { name: 'habitTemplates', plugin: mmkvPlugin } });
