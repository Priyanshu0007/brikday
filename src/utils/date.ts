import { HabitTemplate } from '@/state/types';

/**
 * Returns a timezone-safe date string in the format YYYY-MM-DD for a local Date object.
 */
export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parses a YYYY-MM-DD date string back into a local Date object.
 */
export const parseLocalDateString = (str: string): Date => {
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Checks if a habit is active on a given local Date.
 */
export const isHabitActiveOnDate = (habit: HabitTemplate, date: Date): boolean => {
  const startOf = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy.getTime();
  };

  const targetTime = startOf(date);
  const startTime = startOf(new Date(habit.startDate));

  // Habit was not yet created relative to the target date
  if (targetTime < startTime) return false;

  // If archived before target date, it is not active
  if (habit.archivedAt && targetTime >= startOf(new Date(habit.archivedAt))) return false;

  if (habit.scheduleType === 'daily' || !habit.scheduleType) return true;

  if (habit.scheduleType === 'specific_days') {
    // JS getDay(): 0 is Sunday, 1 is Monday, ..., 6 is Saturday.
    return habit.specificDays?.includes(date.getDay()) ?? false;
  }

  if (habit.scheduleType === 'alternate_days') {
    const msPerDay = 86400000;
    const diffDays = Math.floor((targetTime - startTime) / msPerDay);
    return diffDays % 2 === 0;
  }

  return true;
};

/**
 * Information for a single cell in the calendar/week display.
 */
export interface CalendarCell {
  date: Date;
  dateString: string;
  isCurrentMonth: boolean;
  dayNumber: number;
}

/**
 * Generates dates for the week anchorDate resides in (Monday to Sunday).
 */
export const getWeekDates = (anchorDate: Date): CalendarCell[] => {
  const d = new Date(anchorDate);
  const day = d.getDay();
  // Adjust so that week starts on Monday (1). Sunday (0) goes to index 6.
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));

  const cells: CalendarCell[] = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    cells.push({
      date: dayDate,
      dateString: getLocalDateString(dayDate),
      isCurrentMonth: true,
      dayNumber: dayDate.getDate(),
    });
  }
  return cells;
};

/**
 * Generates a full month calendar grid (usually 35 or 42 cells) starting on Monday.
 */
export const getMonthGrid = (anchorDate: Date): CalendarCell[] => {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  // Alignment to start on Monday:
  // getDay() gives 0 for Sunday, 1 for Monday, etc.
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6; // Sunday is 6

  const cells: CalendarCell[] = [];

  // Padding days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i);
    cells.push({
      date: d,
      dateString: getLocalDateString(d),
      isCurrentMonth: false,
      dayNumber: d.getDate(),
    });
  }

  // Days in current month
  for (let i = 1; i <= totalDays; i++) {
    const d = new Date(year, month, i);
    cells.push({
      date: d,
      dateString: getLocalDateString(d),
      isCurrentMonth: true,
      dayNumber: i,
    });
  }

  // Padding days for next month
  const remaining = cells.length % 7;
  if (remaining > 0) {
    const padding = 7 - remaining;
    for (let i = 1; i <= padding; i++) {
      const d = new Date(year, month + 1, i);
      cells.push({
        date: d,
        dateString: getLocalDateString(d),
        isCurrentMonth: false,
        dayNumber: i,
      });
    }
  }

  return cells;
};

/**
 * Check if two date objects fall on the same day in local time.
 */
export const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Returns full name of weekday (e.g. "MONDAY").
 */
export const getDayName = (date: Date): string => {
  return ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][
    date.getDay()
  ];
};

/**
 * Returns short abbreviation of month (e.g. "JUN").
 */
export const getMonthShortName = (date: Date): string => {
  return ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][
    date.getMonth()
  ];
};

/**
 * Returns full name of month (e.g. "JUNE").
 */
export const getMonthFullName = (date: Date): string => {
  return [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ][date.getMonth()];
};
