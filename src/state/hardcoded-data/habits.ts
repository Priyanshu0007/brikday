import { Habit } from '../types';

export const initialHabits: Habit[] = [
  { id: 'h1', title: 'LOG DAILY SPENDING', completed: false, neglected: false, scheduleType: 'daily', specificDays: [], startDate: Date.now() },
  { id: 'h2', title: '6AM CLUB WAKEUP', completed: true, neglected: false, scheduleType: 'daily', specificDays: [], startDate: Date.now() },
  { id: 'h3', title: 'NO COFFEE BEFORE 10AM', completed: false, neglected: true, scheduleType: 'daily', specificDays: [], startDate: Date.now() },
  { id: 'h4', title: '1 HOUR LEETCODE / SHADERS', completed: false, neglected: false, scheduleType: 'alternate_days', specificDays: [], startDate: Date.now() },
];
