import { authState$ } from './slices/authSlice';
import { userState$ } from './slices/userSlice';
import { habitsState$ } from './slices/habitsSlice';
import { vaultState$ } from './slices/vaultSlice';
import { blueprintState$ } from './slices/blueprintSlice';
import { Habit, ScheduleType, SavingTransaction, VaultGoal, Project } from './types';
import { getLocalDateString } from '@/utils/date';

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
  toggleHabit(id: string, dateStr?: string) {
    const habit = habitsState$.find((h) => h.id.get() === id);
    if (habit) {
      const todayStr = getLocalDateString();
      const targetDateStr = dateStr || todayStr;
      const completedDates = habit.completedDates.get() || [];
      const isCurrentlyCompleted = completedDates.includes(targetDateStr);

      if (isCurrentlyCompleted) {
        habit.completedDates.set(completedDates.filter((d) => d !== targetDateStr));
        if (targetDateStr === todayStr) {
          habit.completed.set(false);
        }
      } else {
        habit.completedDates.set([...completedDates, targetDateStr]);
        if (targetDateStr === todayStr) {
          habit.completed.set(true);
          habit.neglected.set(false);
        }
      }
    }
  },
  addHabit(title: string, scheduleType: ScheduleType = 'daily', specificDays: number[] = [], startDate: number = Date.now()) {
    if (!title.trim()) return;
    const newHabit: Habit = {
      id: `h_${Date.now()}`,
      title: title.toUpperCase(),
      completed: false,
      neglected: false,
      scheduleType,
      specificDays,
      startDate,
      completedDates: [],
    };
    habitsState$.push(newHabit);
  },
  updateHabit(id: string, updates: Partial<Omit<Habit, 'id'>>) {
    const habit = habitsState$.find((h) => h.id.get() === id);
    if (habit) {
      if (updates.title !== undefined) habit.title.set(updates.title);
      if (updates.scheduleType !== undefined) habit.scheduleType.set(updates.scheduleType);
      if (updates.specificDays !== undefined) habit.specificDays.set(updates.specificDays);
      if (updates.startDate !== undefined) habit.startDate.set(updates.startDate);
    }
  },
  deleteHabit(id: string) {
    const habits = habitsState$.get();
    const index = habits.findIndex((h) => h.id === id);
    if (index !== -1) {
      habitsState$[index].delete();
    }
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
};
