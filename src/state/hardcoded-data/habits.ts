import { Habit } from '../types';

// Let's get a timestamp for 30 days ago so the habits are active throughout our monthly calendar view
const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

export const initialHabits: Habit[] = [
  {
    id: 'h1',
    title: 'LOG DAILY SPENDING',
    completed: false,
    neglected: false,
    scheduleType: 'daily',
    specificDays: [],
    startDate: thirtyDaysAgo,
    completedDates: [
      '2026-06-01', '2026-06-02', '2026-06-03', '2026-06-05', 
      '2026-06-06', '2026-06-07', '2026-06-09', '2026-06-10', 
      '2026-06-11', '2026-06-13'
    ]
  },
  {
    id: 'h2',
    title: '6AM CLUB WAKEUP',
    completed: true,
    neglected: false,
    scheduleType: 'daily',
    specificDays: [],
    startDate: thirtyDaysAgo,
    completedDates: [
      '2026-06-02', '2026-06-03', '2026-06-04', '2026-06-06', 
      '2026-06-07', '2026-06-08', '2026-06-10', '2026-06-11', 
      '2026-06-12', '2026-06-13', '2026-06-14'
    ]
  },
  {
    id: 'h3',
    title: 'NO COFFEE BEFORE 10AM',
    completed: false,
    neglected: true,
    scheduleType: 'daily',
    specificDays: [],
    startDate: thirtyDaysAgo,
    completedDates: [
      '2026-06-01', '2026-06-02', '2026-06-04', '2026-06-05', 
      '2026-06-08', '2026-06-09', '2026-06-11', '2026-06-12'
    ]
  },
  {
    id: 'h4',
    title: '1 HOUR LEETCODE / SHADERS',
    completed: false,
    neglected: false,
    scheduleType: 'alternate_days',
    specificDays: [],
    startDate: thirtyDaysAgo,
    completedDates: [
      '2026-06-02', '2026-06-04', '2026-06-06', '2026-06-08', 
      '2026-06-10', '2026-06-12', '2026-06-14'
    ]
  },
];
