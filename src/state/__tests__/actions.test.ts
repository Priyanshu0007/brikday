/**
 * Unit tests for Brikday business logic.
 *
 * Tests cover:
 * - isHabitActiveOnDate() — schedule types (daily, alternate_days, specific_days)
 * - calculateStreak()     — consecutive day counting
 * - generateDailyLogIfMissing() — log creation with schedule respect
 * - toggleHabit()         — completion toggling with timestamp
 * - addSavingTransaction() — transaction appending and saved amount update
 */

import { mockStorage, mmkvInstance } from '../__mocks__/mmkvMock';

// ─── Module mocks (must come before imports that depend on them) ──────────

// Mock react-native-mmkv so dailyLogSlice.ts resolves without native binaries
jest.mock('react-native-mmkv', () => ({
  createMMKV: (_opts?: { id?: string }) => mmkvInstance,
}));

// Mock the Legend State persistence plugin — no-op in tests
jest.mock('@legendapp/state/sync', () => ({
  syncObservable: jest.fn(),
}));

// Mock notification utils so actions.ts doesn't try to import expo-notifications
jest.mock('@/utils/notifications', () => ({
  cancelAllScheduled: jest.fn(),
  scheduleMorningReminder: jest.fn(),
  scheduleEveningRecap: jest.fn(),
  scheduleStreakAlert: jest.fn(),
}));

// ─── Imports under test ───────────────────────────────────────────────────

import { isHabitActiveOnDate, getLocalDateString } from '@/utils/date';
import { HabitTemplate, DailyLog } from '../types';
import { appActions } from '../actions';
import { todayLog$, logIndex$ } from '../slices/dailyLogSlice';
import { habitTemplates$ } from '../slices/habitsSlice';
import { vaultState$, vaultCelebration$ } from '../slices/vaultSlice';

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Create a HabitTemplate with sensible defaults. */
function makeHabit(overrides: Partial<HabitTemplate> = {}): HabitTemplate {
  return {
    id: 'h_test_1',
    title: 'TEST HABIT',
    emoji: '✅',
    scheduleType: 'daily',
    specificDays: [],
    startDate: new Date('2026-01-01').getTime(),
    createdAt: new Date('2026-01-01').getTime(),
    ...overrides,
  };
}

/** Seed a DailyLog into mock MMKV storage. */
function seedLog(dateStr: string, log: DailyLog): void {
  mockStorage.set(`log:${dateStr}`, JSON.stringify(log));
}

/** Build a minimal DailyLog for a given date with all entries completed. */
function makeCompletedLog(dateStr: string, habitIds: string[] = ['h1']): DailyLog {
  return {
    date: dateStr,
    entries: habitIds.map((id) => ({
      habitId: id,
      title: 'HABIT',
      emoji: '✅',
      completed: true,
      completedAt: Date.now(),
    })),
    generatedAt: Date.now(),
  };
}

/** Build a DailyLog with some entries incomplete. */
function makePartialLog(
  dateStr: string,
  completedIds: string[],
  incompleteIds: string[],
): DailyLog {
  return {
    date: dateStr,
    entries: [
      ...completedIds.map((id) => ({
        habitId: id,
        title: 'HABIT',
        emoji: '✅',
        completed: true,
        completedAt: Date.now(),
      })),
      ...incompleteIds.map((id) => ({
        habitId: id,
        title: 'HABIT',
        emoji: '❌',
        completed: false,
        completedAt: undefined,
      })),
    ],
    generatedAt: Date.now(),
  };
}

/** Returns YYYY-MM-DD for N days ago from today. */
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return getLocalDateString(d);
}

// ─── Setup / Teardown ─────────────────────────────────────────────────────

beforeEach(() => {
  // Clear all MMKV data between tests
  mockStorage.clear();
  // Reset observables to clean state
  todayLog$.set(null);
  logIndex$.set([]);
  habitTemplates$.set([]);
  vaultState$.set([]);
  vaultCelebration$.set(null);
});

// ═══════════════════════════════════════════════════════════════════════════
// isHabitActiveOnDate()
// ═══════════════════════════════════════════════════════════════════════════

describe('isHabitActiveOnDate()', () => {
  const startDate = new Date('2026-06-01'); // a Monday

  test('daily schedule — returns true on any day after startDate', () => {
    const habit = makeHabit({ scheduleType: 'daily', startDate: startDate.getTime() });

    // Same day
    expect(isHabitActiveOnDate(habit, new Date('2026-06-01'))).toBe(true);
    // 10 days later
    expect(isHabitActiveOnDate(habit, new Date('2026-06-11'))).toBe(true);
    // 100 days later
    expect(isHabitActiveOnDate(habit, new Date('2026-09-09'))).toBe(true);
  });

  test('returns false before startDate', () => {
    const habit = makeHabit({ scheduleType: 'daily', startDate: startDate.getTime() });
    expect(isHabitActiveOnDate(habit, new Date('2026-05-31'))).toBe(false);
    expect(isHabitActiveOnDate(habit, new Date('2025-12-25'))).toBe(false);
  });

  test('returns false on/after archivedAt date', () => {
    const archiveDate = new Date('2026-06-10');
    const habit = makeHabit({
      scheduleType: 'daily',
      startDate: startDate.getTime(),
      archivedAt: archiveDate.getTime(),
    });
    // Day before archive — still active
    expect(isHabitActiveOnDate(habit, new Date('2026-06-09'))).toBe(true);
    // On archive date — no longer active
    expect(isHabitActiveOnDate(habit, new Date('2026-06-10'))).toBe(false);
    // After archive date
    expect(isHabitActiveOnDate(habit, new Date('2026-06-15'))).toBe(false);
  });

  test('alternate_days — true on even-day-offset, false on odd', () => {
    const habit = makeHabit({
      scheduleType: 'alternate_days',
      startDate: startDate.getTime(),
    });

    // Day 0 (start date itself) — even offset → active
    expect(isHabitActiveOnDate(habit, new Date('2026-06-01'))).toBe(true);
    // Day 1 — odd offset → inactive
    expect(isHabitActiveOnDate(habit, new Date('2026-06-02'))).toBe(false);
    // Day 2 — even → active
    expect(isHabitActiveOnDate(habit, new Date('2026-06-03'))).toBe(true);
    // Day 3 — odd → inactive
    expect(isHabitActiveOnDate(habit, new Date('2026-06-04'))).toBe(false);
  });

  test('specific_days — only active on matching weekdays', () => {
    // 2026-06-01 is a Monday (getDay() === 1)
    const habit = makeHabit({
      scheduleType: 'specific_days',
      specificDays: [1, 3, 5], // Mon, Wed, Fri
      startDate: startDate.getTime(),
    });

    // Monday 2026-06-01 → active
    expect(isHabitActiveOnDate(habit, new Date('2026-06-01'))).toBe(true);
    // Tuesday 2026-06-02 → inactive
    expect(isHabitActiveOnDate(habit, new Date('2026-06-02'))).toBe(false);
    // Wednesday 2026-06-03 → active
    expect(isHabitActiveOnDate(habit, new Date('2026-06-03'))).toBe(true);
    // Thursday 2026-06-04 → inactive
    expect(isHabitActiveOnDate(habit, new Date('2026-06-04'))).toBe(false);
    // Friday 2026-06-05 → active
    expect(isHabitActiveOnDate(habit, new Date('2026-06-05'))).toBe(true);
    // Saturday 2026-06-06 → inactive
    expect(isHabitActiveOnDate(habit, new Date('2026-06-06'))).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// calculateStreak()
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateStreak()', () => {
  test('returns 0 when no logs exist', () => {
    expect(appActions.calculateStreak()).toBe(0);
  });

  test('counts consecutive fully-completed days backwards from yesterday', () => {
    // Seed 3 consecutive completed days ending yesterday
    seedLog(daysAgo(1), makeCompletedLog(daysAgo(1)));
    seedLog(daysAgo(2), makeCompletedLog(daysAgo(2)));
    seedLog(daysAgo(3), makeCompletedLog(daysAgo(3)));

    expect(appActions.calculateStreak()).toBe(3);
  });

  test('breaks streak on a day with incomplete entries', () => {
    // Yesterday: completed
    seedLog(daysAgo(1), makeCompletedLog(daysAgo(1)));
    // 2 days ago: partial (breaks streak)
    seedLog(daysAgo(2), makePartialLog(daysAgo(2), ['h1'], ['h2']));
    // 3 days ago: completed (doesn't count — streak is already broken)
    seedLog(daysAgo(3), makeCompletedLog(daysAgo(3)));

    expect(appActions.calculateStreak()).toBe(1);
  });

  test('breaks streak on a day with zero entries (empty log)', () => {
    seedLog(daysAgo(1), makeCompletedLog(daysAgo(1)));
    // 2 days ago: log exists but has no entries
    seedLog(daysAgo(2), { date: daysAgo(2), entries: [], generatedAt: Date.now() });
    seedLog(daysAgo(3), makeCompletedLog(daysAgo(3)));

    expect(appActions.calculateStreak()).toBe(1);
  });

  test('returns 0 when yesterday has no log', () => {
    // Only have a log from 2 days ago — gap at yesterday
    seedLog(daysAgo(2), makeCompletedLog(daysAgo(2)));

    expect(appActions.calculateStreak()).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// generateDailyLogIfMissing()
// ═══════════════════════════════════════════════════════════════════════════

describe('generateDailyLogIfMissing()', () => {
  const todayStr = getLocalDateString();

  test('creates a new log with correct active habits', () => {
    const habit = makeHabit({ id: 'h_gen_1', title: 'MEDITATE' });
    habitTemplates$.set([habit]);

    appActions.generateDailyLogIfMissing();

    const log = todayLog$.get();
    expect(log).not.toBeNull();
    expect(log!.date).toBe(todayStr);
    expect(log!.entries).toHaveLength(1);
    expect(log!.entries[0].habitId).toBe('h_gen_1');
    expect(log!.entries[0].title).toBe('MEDITATE');
    expect(log!.entries[0].completed).toBe(false);
  });

  test('respects specific_days schedule — excludes habits not scheduled today', () => {
    const today = new Date();
    const todayDow = today.getDay(); // 0-6

    // A habit scheduled ONLY on a different day of the week
    const otherDay = (todayDow + 3) % 7; // guaranteed to be a different day
    const excludedHabit = makeHabit({
      id: 'h_excluded',
      title: 'EXCLUDED',
      scheduleType: 'specific_days',
      specificDays: [otherDay],
    });

    // A daily habit that should always appear
    const includedHabit = makeHabit({
      id: 'h_included',
      title: 'INCLUDED',
      scheduleType: 'daily',
    });

    habitTemplates$.set([excludedHabit, includedHabit]);

    appActions.generateDailyLogIfMissing();

    const log = todayLog$.get();
    expect(log!.entries).toHaveLength(1);
    expect(log!.entries[0].habitId).toBe('h_included');
  });

  test("doesn't duplicate — returns existing log if already present", () => {
    const existingLog: DailyLog = {
      date: todayStr,
      entries: [
        { habitId: 'h_existing', title: 'EXISTING', completed: true, completedAt: 12345 },
      ],
      generatedAt: 99999,
    };
    mockStorage.set(`log:${todayStr}`, JSON.stringify(existingLog));

    habitTemplates$.set([makeHabit({ id: 'h_new', title: 'NEW HABIT' })]);

    appActions.generateDailyLogIfMissing();

    // Should load the existing log, NOT create a new one
    const log = todayLog$.get();
    expect(log!.entries).toHaveLength(1);
    expect(log!.entries[0].habitId).toBe('h_existing');
    expect(log!.entries[0].completed).toBe(true);
  });

  test("adds today's date to logIndex$", () => {
    habitTemplates$.set([makeHabit()]);

    appActions.generateDailyLogIfMissing();

    const index = logIndex$.get();
    expect(index).toContain(todayStr);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// toggleHabit()
// ═══════════════════════════════════════════════════════════════════════════

describe('toggleHabit()', () => {
  const todayStr = getLocalDateString();

  beforeEach(() => {
    // Set up a log with one incomplete habit
    const log: DailyLog = {
      date: todayStr,
      entries: [
        { habitId: 'h_toggle', title: 'TOGGLE ME', completed: false, completedAt: undefined },
      ],
      generatedAt: Date.now(),
    };
    todayLog$.set(log);
    mockStorage.set(`log:${todayStr}`, JSON.stringify(log));
  });

  test('flips completed from false → true and sets completedAt', () => {
    appActions.toggleHabit('h_toggle');

    const log = todayLog$.get();
    expect(log!.entries[0].completed).toBe(true);
    expect(log!.entries[0].completedAt).toBeDefined();
    expect(typeof log!.entries[0].completedAt).toBe('number');
  });

  test('flips completed from true → false and clears completedAt', () => {
    // First toggle: false → true
    appActions.toggleHabit('h_toggle');
    // Second toggle: true → false
    appActions.toggleHabit('h_toggle');

    const log = todayLog$.get();
    expect(log!.entries[0].completed).toBe(false);
    expect(log!.entries[0].completedAt).toBeUndefined();
  });

  test('persists updated log to MMKV storage', () => {
    appActions.toggleHabit('h_toggle');

    const stored = mockStorage.get(`log:${todayStr}`);
    expect(stored).toBeDefined();
    const parsed: DailyLog = JSON.parse(stored!);
    expect(parsed.entries[0].completed).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// addSavingTransaction()
// ═══════════════════════════════════════════════════════════════════════════

describe('addSavingTransaction()', () => {
  beforeEach(() => {
    vaultState$.set([
      {
        id: 'v_test_1',
        title: 'VACATION FUND',
        target: 1000,
        saved: 200,
        transactions: [],
      },
    ]);
  });

  test('appends transaction to the goal', () => {
    appActions.addSavingTransaction('v_test_1', 100, 'Freelance', 'Logo project');

    const goal = vaultState$.get()[0];
    expect(goal.transactions).toHaveLength(1);
    expect(goal.transactions![0].amount).toBe(100);
    expect(goal.transactions![0].source).toBe('Freelance');
    expect(goal.transactions![0].comment).toBe('Logo project');
    expect(goal.transactions![0].id).toBeDefined();
  });

  test('increments saved amount by the transaction amount', () => {
    appActions.addSavingTransaction('v_test_1', 150, 'Salary', 'Monthly');

    const goal = vaultState$.get()[0];
    expect(goal.saved).toBe(350); // 200 + 150
  });

  test('triggers vaultCelebration$ when saved crosses target', () => {
    // Need 800 more to reach 1000 target (currently at 200)
    appActions.addSavingTransaction('v_test_1', 800, 'Bonus', 'Year-end');

    const celebration = vaultCelebration$.get();
    expect(celebration).not.toBeNull();
    expect(celebration!.goalId).toBe('v_test_1');
    expect(celebration!.title).toBe('VACATION FUND');
  });

  test('does NOT trigger celebration when saved does not cross target', () => {
    appActions.addSavingTransaction('v_test_1', 50, 'Tips', 'Coffee tips');

    const celebration = vaultCelebration$.get();
    expect(celebration).toBeNull();
  });
});
