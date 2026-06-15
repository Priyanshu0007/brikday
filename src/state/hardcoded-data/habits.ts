import { HabitTemplate } from '../types';

// Let's get a timestamp for 30 days ago so the habits are active throughout our monthly calendar view
const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

export const initialHabits: HabitTemplate[] = [
  {
    id: 'h1',
    title: 'LOG DAILY SPENDING',
    scheduleType: 'daily',
    specificDays: [],
    startDate: thirtyDaysAgo,
    createdAt: thirtyDaysAgo,
  },
  {
    id: 'h2',
    title: '6AM CLUB WAKEUP',
    scheduleType: 'daily',
    specificDays: [],
    startDate: thirtyDaysAgo,
    createdAt: thirtyDaysAgo,
  },
  {
    id: 'h3',
    title: 'NO COFFEE BEFORE 10AM',
    scheduleType: 'daily',
    specificDays: [],
    startDate: thirtyDaysAgo,
    createdAt: thirtyDaysAgo,
  },
  {
    id: 'h4',
    title: '1 HOUR LEETCODE / SHADERS',
    scheduleType: 'alternate_days',
    specificDays: [],
    startDate: thirtyDaysAgo,
    createdAt: thirtyDaysAgo,
  },
];
