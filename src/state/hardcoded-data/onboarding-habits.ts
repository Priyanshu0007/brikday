/**
 * Curated starter habits for the Onboarding V2 habit picker.
 * Users pick ≥3 from this list (or create custom habits).
 *
 * These are *templates* — `id`, `startDate`, and `createdAt` are generated
 * at selection time in `completeOnboardingV2()`.
 */

import { ScheduleType } from '../types';

export interface OnboardingHabitOption {
  key: string;          // Unique key for selection tracking
  title: string;
  emoji: string;
  category: string;
  categoryColor: string;
  scheduleType: ScheduleType;
}

export const ONBOARDING_HABIT_OPTIONS: OnboardingHabitOption[] = [
  // ── HEALTH ──────────────────────────────
  {
    key: 'ob_h1',
    title: '6AM CLUB WAKEUP',
    emoji: '⏰',
    category: 'HEALTH',
    categoryColor: '#4ADE80',
    scheduleType: 'daily',
  },
  {
    key: 'ob_h2',
    title: 'DRINK 8 GLASSES WATER',
    emoji: '💧',
    category: 'HEALTH',
    categoryColor: '#4ADE80',
    scheduleType: 'daily',
  },
  {
    key: 'ob_h3',
    title: '30 MIN WORKOUT',
    emoji: '💪',
    category: 'HEALTH',
    categoryColor: '#4ADE80',
    scheduleType: 'daily',
  },
  {
    key: 'ob_h4',
    title: 'NO JUNK FOOD',
    emoji: '🥗',
    category: 'HEALTH',
    categoryColor: '#4ADE80',
    scheduleType: 'daily',
  },

  // ── LEARNING ────────────────────────────
  {
    key: 'ob_l1',
    title: 'READ 30 MINUTES',
    emoji: '📖',
    category: 'LEARNING',
    categoryColor: '#38BDF8',
    scheduleType: 'daily',
  },
  {
    key: 'ob_l2',
    title: '1 HOUR CODING PRACTICE',
    emoji: '💻',
    category: 'LEARNING',
    categoryColor: '#38BDF8',
    scheduleType: 'daily',
  },
  {
    key: 'ob_l3',
    title: 'LEARN SOMETHING NEW',
    emoji: '🧠',
    category: 'LEARNING',
    categoryColor: '#38BDF8',
    scheduleType: 'daily',
  },

  // ── FINANCE ─────────────────────────────
  {
    key: 'ob_f1',
    title: 'LOG DAILY SPENDING',
    emoji: '📝',
    category: 'FINANCE',
    categoryColor: '#F472B6',
    scheduleType: 'daily',
  },
  {
    key: 'ob_f2',
    title: 'NO IMPULSE PURCHASES',
    emoji: '🛑',
    category: 'FINANCE',
    categoryColor: '#F472B6',
    scheduleType: 'daily',
  },

  // ── LIFESTYLE ───────────────────────────
  {
    key: 'ob_ls1',
    title: 'JOURNAL BEFORE BED',
    emoji: '✍️',
    category: 'LIFESTYLE',
    categoryColor: '#C084FC',
    scheduleType: 'daily',
  },
  {
    key: 'ob_ls2',
    title: '10 MIN MEDITATION',
    emoji: '🧘',
    category: 'LIFESTYLE',
    categoryColor: '#C084FC',
    scheduleType: 'daily',
  },
  {
    key: 'ob_ls3',
    title: 'NO SOCIAL MEDIA',
    emoji: '📵',
    category: 'LIFESTYLE',
    categoryColor: '#C084FC',
    scheduleType: 'daily',
  },
  {
    key: 'ob_ls4',
    title: 'MAKE YOUR BED',
    emoji: '🛏️',
    category: 'LIFESTYLE',
    categoryColor: '#C084FC',
    scheduleType: 'daily',
  },

  // ── WORK ────────────────────────────────
  {
    key: 'ob_w1',
    title: 'PLAN TOMORROW TONIGHT',
    emoji: '📋',
    category: 'WORK',
    categoryColor: '#FB923C',
    scheduleType: 'daily',
  },
  {
    key: 'ob_w2',
    title: 'DEEP WORK BLOCK',
    emoji: '🎯',
    category: 'WORK',
    categoryColor: '#FB923C',
    scheduleType: 'daily',
  },
];

/** Grouped by category for the picker UI */
export const ONBOARDING_HABIT_CATEGORIES = [
  'HEALTH',
  'LEARNING',
  'FINANCE',
  'LIFESTYLE',
  'WORK',
] as const;

/** Avatar emoji options for profile setup */
export const AVATAR_EMOJI_OPTIONS = [
  '🧱', '🔥', '⚡', '🚀', '💎', '🎯', '🦾', '🧠',
  '🌟', '🏆', '👑', '🎮', '🎸', '🌊', '🦁', '🐉',
  '🌸', '🍀', '🌙', '☀️',
] as const;
