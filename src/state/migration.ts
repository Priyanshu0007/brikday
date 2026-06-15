import { mmkvStorage } from './slices/dailyLogSlice';
import { HabitTemplate, DailyLog } from './types';
import { getLocalDateString, isHabitActiveOnDate, parseLocalDateString } from '@/utils/date';

export function migrateToLogSystem() {
  const version = mmkvStorage.getString('migrationVersion');
  if (version === '2') return;

  const oldHabitsStr = mmkvStorage.getString('habitsState');
  if (!oldHabitsStr) {
    mmkvStorage.set('migrationVersion', '2');
    return;
  }

  try {
    const oldHabits = JSON.parse(oldHabitsStr);
    if (!Array.isArray(oldHabits) || oldHabits.length === 0) {
      mmkvStorage.set('migrationVersion', '2');
      return;
    }
    
    // 1. Create HabitTemplates from old habits
    const templates: HabitTemplate[] = oldHabits.map((h: any) => ({
      id: h.id,
      title: h.title,
      scheduleType: h.scheduleType,
      specificDays: h.specificDays,
      startDate: h.startDate,
      createdAt: h.startDate,
    }));
    
    // 2. Backfill DailyLogs — collect ALL dates where any habit was active,
    //    not just dates where something was completed (preserves "missed" history)
    const allDates = new Set<string>();

    // Find earliest start date across all habits
    const earliestStart = Math.min(...oldHabits.map((h: any) => h.startDate || Date.now()));
    const todayStr = getLocalDateString();
    
    // Walk from earliest start to today, collecting dates where any habit was active
    const cursor = new Date(earliestStart);
    cursor.setHours(0, 0, 0, 0);
    const todayDate = parseLocalDateString(todayStr);
    
    while (cursor <= todayDate) {
      const dateStr = getLocalDateString(cursor);
      const anyActive = templates.some(t => isHabitActiveOnDate(t, cursor));
      if (anyActive) {
        allDates.add(dateStr);
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    
    const logsIndex: string[] = [];
    
    for (const dateStr of allDates) {
      const date = parseLocalDateString(dateStr);
      const log: DailyLog = {
        date: dateStr,
        entries: oldHabits
          .filter((h: any) => isHabitActiveOnDate(h as any, date))
          .map((h: any) => ({
            habitId: h.id,
            title: h.title,
            completed: h.completedDates?.includes(dateStr) ?? false,
          })),
        generatedAt: Date.now(),
      };
      mmkvStorage.set(`log:${dateStr}`, JSON.stringify(log));
      logsIndex.push(dateStr);
    }
    
    // 3. Save templates and mark migration complete
    mmkvStorage.set('habitTemplates', JSON.stringify(templates));
    mmkvStorage.set('logIndex', JSON.stringify(logsIndex));
    
    mmkvStorage.set('migrationVersion', '2');
  } catch (error) {
    console.error('Migration failed', error);
  }
}
