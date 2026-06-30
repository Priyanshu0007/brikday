import { authState$ } from './slices/authSlice';
import { userState$ } from './slices/userSlice';
import { habitTemplates$ } from './slices/habitsSlice';
import { todayLog$, logIndex$, mmkvStorage } from './slices/dailyLogSlice';
import { vaultState$ } from './slices/vaultSlice';
import { blueprintState$ } from './slices/blueprintSlice';
import { notificationState$ } from './slices/notificationSlice';
import {
  HabitTemplate,
  ScheduleType,
  SavingTransaction,
  VaultGoal,
  Project,
  DailyLog,
  DailyHabitEntry,
} from './types';
import { getLocalDateString, isHabitActiveOnDate, getWeekDates } from '@/utils/date';
import {
  cancelAllScheduled,
  scheduleMorningReminder,
  scheduleEveningRecap,
  scheduleStreakAlert,
} from '@/utils/notifications';

export const appActions = {
  completeOnboarding() {
    authState$.status.set('login');
  },
  login(username: string) {
    if (username.trim()) {
      userState$.username.set(username);
    }
    userState$.isLoggedIn.set(true);
    authState$.status.set('authenticated');
  },
  logout() {
    userState$.isLoggedIn.set(false);
    authState$.status.set('login');
  },
  loadTodayLog() {
    const todayStr = getLocalDateString();
    const existingStr = mmkvStorage.getString(`log:${todayStr}`);

    if (existingStr) {
      todayLog$.set(JSON.parse(existingStr));
    } else {
      todayLog$.set(null);
    }
  },
  generateDailyLogIfMissing() {
    const todayStr = getLocalDateString();
    const logKey = `log:${todayStr}`;
    const existingStr = mmkvStorage.getString(logKey);

    if (existingStr) {
      const existing: DailyLog = JSON.parse(existingStr);
      todayLog$.set(existing);
    } else {
      const templates = habitTemplates$.get() || [];
      const activeHabits = templates.filter((t) => isHabitActiveOnDate(t, new Date()));

      const newLog: DailyLog = {
        date: todayStr,
        entries: activeHabits.map((h) => ({
          habitId: h.id,
          title: h.title,
          emoji: h.emoji,
          completed: false,
          completedAt: undefined,
        })),
        generatedAt: Date.now(),
      };

      mmkvStorage.set(logKey, JSON.stringify(newLog));
      todayLog$.set(newLog);

      const index = logIndex$.get() || [];
      if (!index.includes(todayStr)) {
        logIndex$.set([...index, todayStr]);
      }
    }
  },
  toggleHabit(id: string) {
    const todayStr = getLocalDateString();
    const currentLog = todayLog$.get();

    if (currentLog && currentLog.date === todayStr) {
      const entryIndex = currentLog.entries.findIndex((e) => e.habitId === id);
      if (entryIndex !== -1) {
        const completed = !currentLog.entries[entryIndex].completed;
        todayLog$.entries[entryIndex].completed.set(completed);
        todayLog$.entries[entryIndex].completedAt.set(completed ? Date.now() : undefined);

        mmkvStorage.set(`log:${todayStr}`, JSON.stringify(todayLog$.get()));
      }
    }
  },
  isAllCompletedToday(): boolean {
    const currentLog = todayLog$.get();
    if (!currentLog || currentLog.entries.length === 0) return false;

    const todayStr = getLocalDateString();
    if (currentLog.date !== todayStr) return false;

    return currentLog.entries.every((e) => e.completed);
  },
  addHabitNote(habitId: string, note: string) {
    const todayStr = getLocalDateString();
    const currentLog = todayLog$.get();

    if (currentLog && currentLog.date === todayStr) {
      const entryIndex = currentLog.entries.findIndex((e) => e.habitId === habitId);
      if (entryIndex !== -1) {
        todayLog$.entries[entryIndex].note.set(note);
        mmkvStorage.set(`log:${todayStr}`, JSON.stringify(todayLog$.get()));
      }
    }
  },
  addHabit(
    title: string,
    emoji?: string,
    scheduleType: ScheduleType = 'daily',
    specificDays: number[] = [],
    startDate: number = Date.now(),
  ) {
    if (!title.trim()) return;
    const newHabit: HabitTemplate = {
      id: `h_${Date.now()}`,
      title: title.toUpperCase(),
      emoji,
      scheduleType,
      specificDays,
      startDate,
      createdAt: Date.now(),
    };
    habitTemplates$.push(newHabit);

    const todayStr = getLocalDateString();
    if (isHabitActiveOnDate(newHabit, new Date())) {
      const currentLog = todayLog$.get();
      if (currentLog && currentLog.date === todayStr) {
        const newEntry: DailyHabitEntry = {
          habitId: newHabit.id,
          title: newHabit.title,
          emoji: newHabit.emoji,
          completed: false,
          completedAt: undefined,
        };
        todayLog$.entries.push(newEntry);
        mmkvStorage.set(`log:${todayStr}`, JSON.stringify(todayLog$.get()));
      }
    }
  },
  updateHabit(id: string, updates: Partial<Omit<HabitTemplate, 'id'>>) {
    const habit = habitTemplates$.find((h) => h.id.get() === id);
    if (habit) {
      if (updates.title !== undefined) habit.title.set(updates.title);
      if (updates.emoji !== undefined) habit.emoji.set(updates.emoji);
      if (updates.scheduleType !== undefined) habit.scheduleType.set(updates.scheduleType);
      if (updates.specificDays !== undefined) habit.specificDays.set(updates.specificDays);
      if (updates.startDate !== undefined) habit.startDate.set(updates.startDate);

      const todayStr = getLocalDateString();
      const currentLog = todayLog$.get();
      if (currentLog && currentLog.date === todayStr) {
        const entryIndex = currentLog.entries.findIndex((e) => e.habitId === id);
        if (entryIndex !== -1) {
          if (updates.title !== undefined) todayLog$.entries[entryIndex].title.set(updates.title);
          if (updates.emoji !== undefined) todayLog$.entries[entryIndex].emoji.set(updates.emoji);
          mmkvStorage.set(`log:${todayStr}`, JSON.stringify(todayLog$.get()));
        }
      }
    }
  },
  deleteHabit(id: string) {
    const habit = habitTemplates$.find((h) => h.id.get() === id);
    if (habit) {
      habit.archivedAt.set(Date.now());
    }

    const todayStr = getLocalDateString();
    const currentLog = todayLog$.get();
    if (currentLog && currentLog.date === todayStr) {
      const entryIndex = currentLog.entries.findIndex((e) => e.habitId === id);
      if (entryIndex !== -1) {
        const newEntries = currentLog.entries.filter((e) => e.habitId !== id);
        todayLog$.entries.set(newEntries);
        mmkvStorage.set(`log:${todayStr}`, JSON.stringify(todayLog$.get()));
      }
    }
  },
  isHabitNeglected(habitId: string): boolean {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const yesterdayStr = getLocalDateString(date);

    const yesterdayLogStr = mmkvStorage.getString(`log:${yesterdayStr}`);
    if (!yesterdayLogStr) return false;

    const yesterdayLog: DailyLog = JSON.parse(yesterdayLogStr);
    const entry = yesterdayLog.entries.find((e) => e.habitId === habitId);
    return entry ? !entry.completed : false;
  },
  calculateStreak(): number {
    let streak = 0;
    let date = new Date();
    date.setDate(date.getDate() - 1);

    while (true) {
      const dateStr = getLocalDateString(date);
      const logStr = mmkvStorage.getString(`log:${dateStr}`);

      if (!logStr) break;
      const log: DailyLog = JSON.parse(logStr);
      if (log.entries.length === 0) break;

      const allCompleted = log.entries.every((e) => e.completed);
      if (!allCompleted) break;

      streak++;
      date.setDate(date.getDate() - 1);
    }

    return streak;
  },
  getDayStats(dateStr: string) {
    const logStr = mmkvStorage.getString(`log:${dateStr}`);
    if (!logStr) return { completed: 0, total: 0, rate: 0, entries: [] };

    const log: DailyLog = JSON.parse(logStr);
    const completed = log.entries.filter((e) => e.completed).length;
    return {
      completed,
      total: log.entries.length,
      rate: log.entries.length > 0 ? completed / log.entries.length : 0,
      entries: log.entries,
    };
  },
  getHabitHistory(habitId: string, dateRange: string[]) {
    return dateRange.map((dateStr) => {
      const logStr = mmkvStorage.getString(`log:${dateStr}`);
      if (!logStr) return { date: dateStr, completed: false, isScheduled: false };

      const log: DailyLog = JSON.parse(logStr);
      const entry = log.entries.find((e) => e.habitId === habitId);
      return {
        date: dateStr,
        completed: entry?.completed ?? false,
        isScheduled: !!entry,
      };
    });
  },
  updateVaultGoalSaved(id: string, saved: number) {
    const goal = vaultState$.find((g) => g.id.get() === id);
    if (goal) {
      goal.saved.set(saved);
    }
  },
  addSavingTransaction(goalId: string, amount: number, source: string, comment: string) {
    const goal = vaultState$.find((g) => g.id.get() === goalId);
    if (goal) {
      const currentTxns = goal.transactions.get() || [];
      const newTransaction: SavingTransaction = {
        id: `t_${Date.now()}`,
        amount,
        source: source.trim(),
        comment: comment.trim(),
        date: Date.now(),
      };

      goal.transactions.set([...currentTxns, newTransaction]);

      goal.saved.set(goal.saved.get() + amount);
    }
  },
  addVaultGoal(title: string, target: number) {
    if (!title.trim() || target <= 0) return;
    const newGoal: VaultGoal = {
      id: `v_${Date.now()}`,
      title: title.toUpperCase(),
      target,
      saved: 0,
      transactions: [],
    };
    vaultState$.push(newGoal);
  },
  updateVaultGoal(id: string, updates: Partial<Omit<VaultGoal, 'id' | 'transactions' | 'saved'>>) {
    const goal = vaultState$.find((g) => g.id.get() === id);
    if (goal) {
      if (updates.title !== undefined) goal.title.set(updates.title);
      if (updates.target !== undefined) goal.target.set(updates.target);
    }
  },
  deleteVaultGoal(id: string) {
    const goals = vaultState$.get();
    const index = goals.findIndex((g) => g.id === id);
    if (index !== -1) {
      vaultState$[index].delete();
    }
  },
  addProject(title: string, category: string, neglected: boolean = false) {
    if (!title.trim()) return;
    const newProject: Project = {
      id: `p_${Date.now()}`,
      title: title.toUpperCase(),
      category: category.toUpperCase() || 'GENERAL',
      neglected,
      milestones: [],
    };
    blueprintState$.push(newProject);
  },
  updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'neglected'>>) {
    const project = blueprintState$.find((p) => p.id.get() === id);
    if (project) {
      if (updates.title !== undefined) project.title.set(updates.title);
      if (updates.category !== undefined) project.category.set(updates.category);
    }
  },
  deleteProject(id: string) {
    const projects = blueprintState$.get();
    const index = projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      blueprintState$[index].delete();
    }
  },
  addMilestone(projectId: string, title: string) {
    if (!title.trim()) return;
    const project = blueprintState$.find((p) => p.id.get() === projectId);
    if (project) {
      const currentMilestones = project.milestones.get() || [];
      project.milestones.set([
        ...currentMilestones,
        {
          id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: title.trim(),
          completed: false,
        },
      ]);
    }
  },
  toggleMilestone(projectId: string, milestoneId: string) {
    const project = blueprintState$.find((p) => p.id.get() === projectId);
    if (project) {
      const milestones = project.milestones.get() || [];
      const milestoneIndex = milestones.findIndex((m) => m.id === milestoneId);
      if (milestoneIndex !== -1) {
        const newMilestones = [...milestones];
        newMilestones[milestoneIndex] = {
          ...newMilestones[milestoneIndex],
          completed: !newMilestones[milestoneIndex].completed,
        };
        project.milestones.set(newMilestones);
      }
    }
  },
  editMilestone(projectId: string, milestoneId: string, newTitle: string) {
    if (!newTitle.trim()) return;
    const project = blueprintState$.find((p) => p.id.get() === projectId);
    if (project) {
      const milestones = project.milestones.get() || [];
      const milestoneIndex = milestones.findIndex((m) => m.id === milestoneId);
      if (milestoneIndex !== -1) {
        const newMilestones = [...milestones];
        newMilestones[milestoneIndex] = {
          ...newMilestones[milestoneIndex],
          title: newTitle.trim(),
        };
        project.milestones.set(newMilestones);
      }
    }
  },
  deleteMilestone(projectId: string, milestoneId: string) {
    const project = blueprintState$.find((p) => p.id.get() === projectId);
    if (project) {
      const milestones = project.milestones.get() || [];
      const newMilestones = milestones.filter((m) => m.id !== milestoneId);
      project.milestones.set(newMilestones);
    }
  },
  toggleProjectNeglect(id: string) {
    const project = blueprintState$.find((p) => p.id.get() === id);
    if (project) {
      project.neglected.set(!project.neglected.get());
    }
  },
  updateProfile(username: string, role: string) {
    if (username.trim()) userState$.username.set(username);
    if (role.trim()) userState$.role.set(role);
  },
  updateCurrency(code: string) {
    userState$.currencyCode.set(code);
  },
  async updateNotificationSettings(
    updates: Partial<{
      morningReminder: { enabled: boolean; hour: number; minute: number };
      eveningRecap: { enabled: boolean; hour: number; minute: number };
      streakAlert: { enabled: boolean };
    }>
  ) {
    if (updates.morningReminder) {
      notificationState$.morningReminder.set(updates.morningReminder);
    }
    if (updates.eveningRecap) {
      notificationState$.eveningRecap.set(updates.eveningRecap);
    }
    if (updates.streakAlert) {
      notificationState$.streakAlert.set(updates.streakAlert);
    }
    await this.rescheduleNotifications();
  },
  async rescheduleNotifications() {
    await cancelAllScheduled();

    const prefs = notificationState$.get();

    if (prefs.morningReminder.enabled) {
      await scheduleMorningReminder(
        prefs.morningReminder.hour,
        prefs.morningReminder.minute
      );
    }

    if (prefs.eveningRecap.enabled) {
      await scheduleEveningRecap(
        prefs.eveningRecap.hour,
        prefs.eveningRecap.minute
      );
    }

    if (prefs.streakAlert.enabled) {
      await scheduleStreakAlert();
    }
  },
  getWeekSummary(weekAnchorDate: Date) {
    const cells = getWeekDates(weekAnchorDate);
    let totalScheduled = 0;
    let totalCompleted = 0;
    
    let bestDay = { rate: -1, name: '', dateStr: '' };
    let worstDay = { rate: 2, name: '', dateStr: '' };

    const habitMap: Record<string, { title: string, scheduled: number, completed: number }> = {};
    const templates = habitTemplates$.get() || [];
    templates.forEach(t => {
      if (!t.archivedAt) {
        habitMap[t.id] = { title: t.title, scheduled: 0, completed: 0 };
      }
    });

    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    for (const cell of cells) {
      const stats = this.getDayStats(cell.dateString);
      totalScheduled += stats.total;
      totalCompleted += stats.completed;

      if (stats.total > 0) {
        if (stats.rate > bestDay.rate) {
          bestDay = { rate: stats.rate, name: dayNames[cell.date.getDay()], dateStr: cell.dateString };
        }
        if (stats.rate < worstDay.rate) {
          worstDay = { rate: stats.rate, name: dayNames[cell.date.getDay()], dateStr: cell.dateString };
        }
      }

      stats.entries.forEach(e => {
        if (habitMap[e.habitId]) {
          habitMap[e.habitId].scheduled++;
          if (e.completed) {
            habitMap[e.habitId].completed++;
          }
        }
      });
    }

    const perHabitRates = Object.values(habitMap)
      .filter(h => h.scheduled > 0)
      .map(h => ({
        title: h.title,
        scheduledCount: h.scheduled,
        completedCount: h.completed,
        rate: h.scheduled > 0 ? h.completed / h.scheduled : 0,
      }))
      .sort((a, b) => b.rate - a.rate); // highest rate first

    const totalRate = totalScheduled > 0 ? totalCompleted / totalScheduled : 0;

    return {
      totalRate,
      bestDay: bestDay.rate >= 0 ? `${bestDay.name} (${Math.round(bestDay.rate * 100)}%)` : 'NONE',
      worstDay: worstDay.rate <= 1 ? `${worstDay.name} (${Math.round(worstDay.rate * 100)}%)` : 'NONE',
      perHabitRates,
    };
  },
};
